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
import {handleCallError, handleErrorResponse} from "./utils"
import path from "path"
import fs from "fs"
import {fileURLToPath} from "url"
import Mustache from "mustache"

// timeout in ms to wait for response from spine to avoid lambda timeout
const SPINE_TIMEOUT = 45000

// Clinical Content View Globals
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLINICAL_CONTENT_VIEW_TEMPLATE =
  fs.readFileSync(path.join(__dirname, "resources/clinical_content_view_sandbox.xml"), "utf8")
    .replace(/\n/g, "\r\n")
const CLINICAL_VIEW_REQUEST_PATH = "syncservice-pds/pds"

export interface ClinicalViewParams {
    requestId: string,
    prescriptionId: string,
    organizationId: string,
    repeatNumber?: string,
    sdsRoleProfileId: string,
    sdsId: string,
    jobRoleCode: string
}

interface ClinicalContentViewPartials {
    messageGUID: string,
    toASID: string,
    fromASID: string
    creationTime: string,
    agentPersonSDSRoleProfileId: string,
    agentPersonSDSId: string,
    agentPersonJobRoleCode: string,
    organizationId: string,
    prescriptionId: string,
    repeatNumber: string
}

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
      onRetry: this.onAxiosRetry,
      // Force retry on post requests with non-timeout errors
      retryCondition: (error) => error.code !== "ECONNABORTED"
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
      handleErrorResponse(this.logger, response)
      return response
    } catch (error) {
      handleCallError(this.logger, error)
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

  async clinicalView(params: ClinicalViewParams): Promise<AxiosResponse> {
    try {
      const address = this.getSpineEndpoint(CLINICAL_VIEW_REQUEST_PATH)

      const partials: ClinicalContentViewPartials = {
        messageGUID: params.requestId,
        toASID: this.spineASID,
        fromASID: this.spineASID,
        creationTime: new Date().getTime().toString(),
        agentPersonSDSRoleProfileId: params.sdsRoleProfileId,
        agentPersonSDSId: params.sdsId,
        agentPersonJobRoleCode: params.jobRoleCode,
        organizationId: params.organizationId,
        prescriptionId: params.prescriptionId,
        repeatNumber: params.repeatNumber ?? ""
      }
      const requestBody = Mustache.render(CLINICAL_CONTENT_VIEW_TEMPLATE, partials)

      const headers = {
        "SOAPAction": "urn:nhs:names:services:mmquery/QURX_IN000005UK98"
      }

      this.logger.info(`making request to ${address}`)
      const response = await this.axiosInstance.post(address, requestBody, {
        headers: headers,
        httpsAgent: this.httpsAgent,
        timeout: SPINE_TIMEOUT
      })

      handleErrorResponse(this.logger, response)
      return response
    } catch(error) {
      handleCallError(this.logger, error)
    }
  }

  onAxiosRetry = (retryCount, error) => {
    this.logger.warn(error)
    this.logger.warn(`Call to spine failed - retrying. Retry count ${retryCount}`)
  }
}
