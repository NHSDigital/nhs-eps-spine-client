import {LiveSpineClient} from "../src/live-spine-client"
import {jest, expect, describe} from "@jest/globals"
import MockAdapter from "axios-mock-adapter"
import axios from "axios"
import {Logger} from "@aws-lambda-powertools/logger"
import {APIGatewayProxyEventHeaders} from "aws-lambda"

const mock = new MockAdapter(axios)
process.env.TargetSpineServer = "spine"
type spineFailureTestData = {
  httpResponseCode: number
  spineStatusCode: string
  nhsdLoginUser: string | undefined
  errorMessage: string
  scenarioDescription: string
}

describe("live spine client", () => {
  const logger = new Logger({serviceName: "spineClient"})
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {...originalEnv}
  })

  afterEach(() => {
    mock.reset()
  })

  test("successful response when http response is status 200 and spine status does not exist", async () => {
    mock.onGet("https://spine/mm/patientfacingprescriptions").reply(200, {resourceType: "Bundle"})
    const spineClient = new LiveSpineClient(logger)
    const headers: APIGatewayProxyEventHeaders = {
      "nhsd-nhslogin-user": "P9:9912003071"
    }
    const spineResponse = await spineClient.getPrescriptions(headers)

    expect(spineResponse.status).toBe(200)
    expect(spineResponse.data).toStrictEqual({resourceType: "Bundle"})
  })

  test("log response time on successful call", async () => {
    mock.onGet("https://spine/mm/patientfacingprescriptions").reply(200, {resourceType: "Bundle"})
    const mockLoggerInfo = jest.spyOn(Logger.prototype, "info")
    const spineClient = new LiveSpineClient(logger)
    const headers: APIGatewayProxyEventHeaders = {
      "nhsd-nhslogin-user": "P9:9912003071"
    }
    await spineClient.getPrescriptions(headers)

    expect(mockLoggerInfo).toHaveBeenCalledWith("spine request duration", {"spine_duration": expect.any(Number)})
  })

  test("log response time on unsuccessful call", async () => {
    mock.onGet("https://spine/mm/patientfacingprescriptions").reply(401)
    const mockLoggerInfo = jest.spyOn(Logger.prototype, "info")
    const spineClient = new LiveSpineClient(logger)
    const headers: APIGatewayProxyEventHeaders = {
      "nhsd-nhslogin-user": "P9:9912003071"
    }
    await expect(spineClient.getPrescriptions(headers)).rejects.toThrow("Request failed with status code 401")

    expect(mockLoggerInfo).toHaveBeenCalledWith("spine request duration", {"spine_duration": expect.any(Number)})
  })

  test.each<spineFailureTestData>([
    {
      httpResponseCode: 200,
      spineStatusCode: "99",
      nhsdLoginUser: "P9:9912003071",
      errorMessage: "Unsuccessful status code response from spine",
      scenarioDescription: "spine returns a non successful response status"
    },
    {
      httpResponseCode: 500,
      spineStatusCode: "0",
      nhsdLoginUser: "P9:9912003071",
      errorMessage: "Request failed with status code 500",
      scenarioDescription: "spine returns an unsuccessful http status code"
    }
  ])(
    "throw error when $scenarioDescription",
    async ({httpResponseCode, spineStatusCode, nhsdLoginUser, errorMessage}) => {
      mock.onGet("https://spine/mm/patientfacingprescriptions").reply(httpResponseCode, {statusCode: spineStatusCode})
      const spineClient = new LiveSpineClient(logger)
      const headers: APIGatewayProxyEventHeaders = {
        "nhsd-nhslogin-user": nhsdLoginUser
      }
      await expect(spineClient.getPrescriptions(headers)).rejects.toThrow(errorMessage)
    }
  )

  test("should throw error when unsuccessful http request", async () => {
    mock.onGet("https://spine/mm/patientfacingprescriptions").networkError()

    const spineClient = new LiveSpineClient(logger)
    const headers: APIGatewayProxyEventHeaders = {
      "nhsd-nhslogin-user": "P9:9912003071"
    }
    await expect(spineClient.getPrescriptions(headers)).rejects.toThrow("Network Error")
  })

  test("should throw error when timeout on http request", async () => {
    mock.onGet("https://spine/mm/patientfacingprescriptions").timeout()

    const spineClient = new LiveSpineClient(logger)
    const headers: APIGatewayProxyEventHeaders = {
      "nhsd-nhslogin-user": "P9:9912003071"
    }
    await expect(spineClient.getPrescriptions(headers)).rejects.toThrow("timeout of 45000ms exceeded")
  })

  test("should not throw error when one unsuccessful and one successful http request", async () => {
    mock
      .onGet("https://spine/mm/patientfacingprescriptions").networkErrorOnce()
      .onGet("https://spine/mm/patientfacingprescriptions").reply(200, {resourceType: "Bundle"})

    const mockLoggerWarn = jest.spyOn(Logger.prototype, "warn")

    const spineClient = new LiveSpineClient(logger)
    const headers: APIGatewayProxyEventHeaders = {
      "nhsd-nhslogin-user": "P9:9912003071"
    }
    const spineResponse = await spineClient.getPrescriptions(headers)

    expect(spineResponse.status).toBe(200)
    expect(spineResponse.data).toStrictEqual({resourceType: "Bundle"})
    expect(mockLoggerWarn).toHaveBeenCalledWith("Call to spine failed - retrying. Retry count 1")
  })

  test("should retry only 3 times when http request errors", async () => {
    mock.onGet("https://spine/mm/patientfacingprescriptions").networkError()
    const mockLoggerWarn = jest.spyOn(Logger.prototype, "warn")

    const spineClient = new LiveSpineClient(logger)
    const headers: APIGatewayProxyEventHeaders = {
      "nhsd-nhslogin-user": "P9:9912003071"
    }
    await expect(spineClient.getPrescriptions(headers)).rejects.toThrow("Network Error")
    expect(mockLoggerWarn).toHaveBeenCalledWith("Call to spine failed - retrying. Retry count 1")
    expect(mockLoggerWarn).toHaveBeenCalledWith("Call to spine failed - retrying. Retry count 2")
    expect(mockLoggerWarn).toHaveBeenCalledWith("Call to spine failed - retrying. Retry count 3")
    expect(mockLoggerWarn).not.toHaveBeenCalledWith("Call to spine failed - retrying. Retry count 4")
  })

  test("successful prescription search", async () => {
    const soapResponse = `
    <?xml version="1.0" encoding="utf-8"?>
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Body>
        <PRESCRIPTIONSEARCH_SM01_RESPONSE xmlns="urn:hl7-org:v3">
          <ControlActEvent>
            <query>
              <prescriptionId value="12345"/>
              <prescriberOrganisation value="ABCD"/>
            </query>
          </ControlActEvent>
        </PRESCRIPTIONSEARCH_SM01_RESPONSE>
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
  `
    mock.onPost("https://spine/syncservice-mm/mm").reply(200, soapResponse)

    const spineClient = new LiveSpineClient(logger)
    const requestId = "request-id"
    const prescriptionId = "12345"
    const prescriberOds = "ABCD"
    const response = await spineClient.prescriptionSearch(requestId, prescriptionId, prescriberOds)

    expect(response.status).toBe(200)
    expect(response.data).toContain("<prescriptionId value=\"12345\"/>")
    expect(response.data).toContain("<prescriberOrganisation value=\"ABCD\"/>")
  })

  test("throw error on SOAP request failure", async () => {
    mock.onPost("https://spine/syncservice-mm/mm").networkError()

    const spineClient = new LiveSpineClient(logger)
    const requestId = "request-id"
    const prescriptionId = "12345"
    const prescriberOds = "ABCD"

    await expect(spineClient.prescriptionSearch(requestId, prescriptionId, prescriberOds)).rejects.toThrow("Network Error")
  })

  test("throw error on SOAP request timeout", async () => {
    mock.onPost("https://spine/syncservice-mm/mm").timeout()

    const spineClient = new LiveSpineClient(logger)
    const requestId = "request-id"
    const prescriptionId = "12345"
    const prescriberOds = "ABCD"

    await expect(spineClient.prescriptionSearch(requestId, prescriptionId, prescriberOds)).rejects.toThrow("timeout of 45000ms exceeded")
  })

  test("return health check status as 'pass' if certificate is not configured", async () => {
    process.env.SpinePublicCertificate = "ChangeMe"
    process.env.SpinePrivateKey = "ChangeMe"
    process.env.SpineCAChain = "ChangeMe"

    const spineClient = new LiveSpineClient(logger)
    const status = await spineClient.getStatus()

    expect(status).toEqual({status: "pass", message: "Spine certificate is not configured"})
  })

  test("return health check status as 'pass' on successful status check", async () => {
    mock.onGet("https://spine/healthcheck").reply(200, {status: "pass"})

    const spineClient = new LiveSpineClient(logger)
    const status = await spineClient.getStatus()

    expect(status.status).toBe("pass")
  })

  test("return health check status as 'error' on failed status check", async () => {
    mock.onGet("https://spine/healthcheck").reply(500)

    const spineClient = new LiveSpineClient(logger)
    const status = await spineClient.getStatus()

    expect(status.status).toBe("error")
  })
})
