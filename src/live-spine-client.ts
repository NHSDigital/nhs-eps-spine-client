import {Logger} from "@aws-lambda-powertools/logger"
import {serviceHealthCheck} from "./status"
import {SpineClient, SpineStatus} from "./spine-client"
import {Agent} from "https"
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from "axios"
import {APIGatewayProxyEventHeaders} from "aws-lambda"
import axiosRetry from "axios-retry"

// timeout in ms to wait for response from spine to avoid lambda timeout
const SPINE_TIMEOUT = 45000

export class LiveSpineClient implements SpineClient {
  private readonly SPINE_URL_SCHEME = "https"
  private readonly SPINE_ENDPOINT = process.env.TargetSpineServer
  private readonly spineASID: string | undefined
  private readonly httpsAgent: Agent
  private readonly spinePartyKey: string | undefined
  private readonly axiosInstance: AxiosInstance
  private readonly logger: Logger

  constructor(logger: Logger) {
    this.spineASID = process.env.SpineASID
    this.spinePartyKey = process.env.SpinePartyKey

    this.httpsAgent = new Agent({
      cert: process.env.SpinePublicCertificate,
      key: process.env.SpinePrivateKey,
      ca: process.env.SpineCAChain,
      keepAlive: true
    })
    this.logger = logger
    this.axiosInstance = axios.create()
    axiosRetry(this.axiosInstance, {
      retries: 3,
      onRetry: this.onAxiosRetry
    })
    this.axiosInstance.interceptors.request.use((config) => {
      config.headers["request-startTime"] = new Date().getTime()
      return config
    })

    this.axiosInstance.interceptors.response.use((response: AxiosResponse) => {
      const currentTime = new Date().getTime()
      const startTime = response.config.headers["request-startTime"]
      this.logger.info("spine request duration", {spine_duration: currentTime - startTime})

      return response
    }, (error: AxiosError) => {
      const currentTime = new Date().getTime()
      const startTime = error.config?.headers["request-startTime"]
      this.logger.info("spine request duration", {spine_duration: currentTime - startTime})

      return Promise.reject(error)
    })

  }
  async getPrescriptions(inboundHeaders: APIGatewayProxyEventHeaders): Promise<AxiosResponse> {
    try {
      const address = this.getSpineEndpoint("mm/patientfacingprescriptions")
      // nhsd-nhslogin-user looks like P9:9912003071

      const outboundHeaders = {
        Accept: "application/json",
        "Spine-From-Asid": this.spineASID,
        "nhsd-party-key": this.spinePartyKey,
        nhsNumber: inboundHeaders["nhsNumber"],
        "nhsd-correlation-id": inboundHeaders["nhsd-correlation-id"],
        "nhsd-nhslogin-user": inboundHeaders["nhsd-nhslogin-user"],
        "x-request-id": inboundHeaders["x-request-id"],
        "x-correlation-id": inboundHeaders["x-correlation-id"],
        "nhsd-request-id": inboundHeaders["nhsd-request-id"]
      }

      const queryParams = {
        format: "trace-summary"
      }
      this.logger.info(`making request to ${address}`)
      const response = await this.axiosInstance.get(address, {
        headers: outboundHeaders,
        params: queryParams,
        httpsAgent: this.httpsAgent,
        timeout: SPINE_TIMEOUT
      })

      // This can be removed when https://nhsd-jira.digital.nhs.uk/browse/AEA-3448 is complete
      if (
        response.data["statusCode"] !== undefined &&
        response.data["statusCode"] !== "1" &&
        response.data["statusCode"] !== "0"
      ) {
        this.logger.error("Unsuccessful status code response from spine", {
          response: {
            data: response.data,
            status: response.status,
            Headers: response.headers
          }
        })
        throw new Error("Unsuccessful status code response from spine")
      }
      return response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          this.logger.error("error in response from spine", {
            response: {
              data: error.response.data,
              status: error.response.status,
              Headers: error.response.headers
            },
            request: {
              method: error.request?.path,
              params: error.request?.params,
              headers: error.request?.headers,
              host: error.request?.host
            }
          })
        } else if (error.request) {
          this.logger.error("error in request to spine", {
            method: error.request.method,
            path: error.request.path,
            params: error.request.params,
            headers: error.request.headers,
            host: error.request.host
          })
        } else {
          this.logger.error("general error calling spine", {error})
        }
      } else {
        this.logger.error("general error", {error})
      }
      throw error
    }
  }

  private getSpineEndpoint(requestPath?: string) {
    return `${this.SPINE_URL_SCHEME}://${this.SPINE_ENDPOINT}/${requestPath}`
  }

  async getStatus(): Promise<SpineStatus> {
    if (!this.isCertificateConfigured()) {
      return {status: "pass", message: "Spine certificate is not configured"}
    }

    const axiosConfig: AxiosRequestConfig = {timeout: 20000}
    let endpoint: string

    if (process.env.healthCheckUrl === undefined) {
      axiosConfig.httpsAgent = this.httpsAgent
      endpoint = this.getSpineEndpoint("healthcheck")
    } else {
      axiosConfig.httpsAgent = new Agent()
      endpoint = process.env.healthCheckUrl
    }

    const spineStatus = await serviceHealthCheck(endpoint, this.logger, axiosConfig, this.axiosInstance)
    return {status: spineStatus.status, spineStatus: spineStatus}
  }

  isCertificateConfigured(): boolean {
    // Check if the required certificate-related environment variables are defined
    return (
      process.env.SpinePublicCertificate !== "ChangeMe" &&
      process.env.SpinePrivateKey !== "ChangeMe" &&
      process.env.SpineCAChain !== "ChangeMe"
    )
  }

  onAxiosRetry = (retryCount, error) => {
    this.logger.warn(error)
    this.logger.warn(`Call to spine failed - retrying. Retry count ${retryCount}`)
  }

  async prescriptionSearch(
    requestId: string,
    prescriptionId: string,
    prescriberOds: string
  ): Promise<AxiosResponse> {
    const soapAction = "urn:nhs:names:services:mmquery/PRESCRIPTIONSEARCH_SM01"
    const endpoint = this.getSpineEndpoint("syncservice-mm/mm")

    const soapEnvelope = `
    <?xml version="1.0" encoding="utf-8"?>
    <SOAP-ENV:Envelope 
      xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" 
      xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" 
      xmlns:hl7="urn:hl7-org:v3">
        <SOAP-ENV:Header>
            <wsa:MessageID>uuid:${requestId}</wsa:MessageID>
            <wsa:Action>${soapAction}</wsa:Action>
            <wsa:To>${endpoint}</wsa:To>
            <wsa:From><wsa:Address/></wsa:From>
            <wsa:ReplyTo><wsa:Address/></wsa:ReplyTo>
            <hl7:communicationFunctionRcv>
                <hl7:device>
                    <hl7:id root="1.2.826.0.1285.0.2.0.107" extension="200000002066"/>
                </hl7:device>
            </hl7:communicationFunctionRcv>
            <hl7:communicationFunctionSnd>
                <hl7:device>
                    <hl7:id root="1.2.826.0.1285.0.2.0.107" extension="200000002066"/>
                </hl7:device>
            </hl7:communicationFunctionSnd>
        </SOAP-ENV:Header>
        <SOAP-ENV:Body>
            <PRESCRIPTIONSEARCH_SM01 xmlns="urn:hl7-org:v3">
                <id root="${requestId}"/>
                <creationTime value="${this.getCurrentTimestamp()}"/>
                <versionCode code="V3NPfIT4.2.00"/>
                <interactionId root="2.16.840.1.113883.2.1.3.2.4.12" extension="PRESCRIPTIONSEARCH_SM01"/>
                <processingCode code="P"/>
                <processingModeCode code="T"/>
                <acceptAckCode code="NE"/>
                <communicationFunctionRcv>
                    <device classCode="DEV" determinerCode="INSTANCE">
                        <id root="1.2.826.0.1285.0.2.0.107" extension="200000002066"/>
                    </device>
                </communicationFunctionRcv>
                <communicationFunctionSnd>
                    <device classCode="DEV" determinerCode="INSTANCE">
                        <id root="1.2.826.0.1285.0.2.0.107" extension="200000002066"/>
                    </device>
                </communicationFunctionSnd>
                <ControlActEvent classCode="CACT" moodCode="EVN">
                    <author typeCode="AUT">
                        <AgentPersonSDS classCode="AGNT">
                            <id root="1.2.826.0.1285.0.2.0.67" extension="123456123456"/>
                            <agentPersonSDS classCode="PSN" determinerCode="INSTANCE">
                                <id root="1.2.826.0.1285.0.2.0.65" extension="123456123456"/>
                            </agentPersonSDS>
                            <part typeCode="PART">
                                <partSDSRole classCode="ROL">
                                    <id root="1.2.826.0.1285.0.2.1.104" extension="123456123456"/>
                                </partSDSRole>
                            </part>
                        </AgentPersonSDS>
                    </author>
                    <author1 typeCode="AUT">
                        <AgentSystemSDS classCode="AGNT">
                            <agentSystemSDS classCode="DEV" determinerCode="INSTANCE">
                                <id root="1.2.826.0.1285.0.2.0.107" extension="200000002066"/>
                            </agentSystemSDS>
                        </AgentSystemSDS>
                    </author1>
                    <query>
                        <prescriptionId value="${prescriptionId}"/>
                        <prescriberOrganisation value="${prescriberOds}"/>
                    </query>
                </ControlActEvent>
            </PRESCRIPTIONSEARCH_SM01>
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`

    try {
      const response = await this.axiosInstance.post(endpoint, soapEnvelope, {
        headers: {
          "Content-Type": "text/xml",
          "SOAPAction": soapAction
        },
        httpsAgent: this.httpsAgent,
        timeout: SPINE_TIMEOUT
      })

      return response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          this.logger.error("error in response from spine", {
            response: {
              data: error.response.data,
              status: error.response.status,
              Headers: error.response.headers
            },
            request: {
              method: error.request?.path,
              params: error.request?.params,
              headers: error.request?.headers,
              host: error.request?.host
            }
          })
        } else if (error.request) {
          this.logger.error("error in request to spine", {
            method: error.request.method,
            path: error.request.path,
            params: error.request.params,
            headers: error.request.headers,
            host: error.request.host
          })
        } else {
          this.logger.error("general error calling spine", {error})
        }
      } else {
        this.logger.error("general error", {error})
      }
      throw error
    }
  }

  private getCurrentTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString()
  }
}
