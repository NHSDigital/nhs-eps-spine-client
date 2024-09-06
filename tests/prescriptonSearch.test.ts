import {PrescriptionSearchParams, LiveSpineClient} from "../src/live-spine-client"
import {jest, expect, describe} from "@jest/globals"
import MockAdapter from "axios-mock-adapter"
import axios from "axios"
import {Logger} from "@aws-lambda-powertools/logger"

const mock = new MockAdapter(axios)
process.env.TargetSpineServer = "spine"
type spineFailureTestData = {
  httpResponseCode: number
  spineStatusCode: string
  errorMessage: string
  scenarioDescription: string
}

const mockParams: PrescriptionSearchParams = {
  requestId: "request_id",
  prescriptionId: "prescription_id",
  organizationId: "organization_id",
  sdsRoleProfileId: "sds_role_profile_id",
  sdsId: "sds_id",
  jobRoleCode: "job_role_code"
}

const mockResponse = "<xml></xml>"
const mockAddress = "https://spine/syncservice-pds/pds"
const mockHeaders = {}

describe("live prescriptionSearch", () => {
  const logger = new Logger({serviceName: "spineClient"})

  afterEach(() => {
    mock.reset()
  })

  test("successful response when http response is status 200", async () => {
    mock.onPost(mockAddress).reply(200, mockResponse)
    const spineClient = new LiveSpineClient(logger)
    const spineResponse = await spineClient.prescriptionSearch(mockHeaders, mockParams)

    expect(spineResponse.status).toBe(200)
    expect(spineResponse.data).toStrictEqual(mockResponse)
  })

  test("log response time on successful call", async () => {
    mock.onPost(mockAddress).reply(200, mockResponse)
    const mockLoggerInfo = jest.spyOn(Logger.prototype, "info")
    const spineClient = new LiveSpineClient(logger)

    await spineClient.prescriptionSearch(mockHeaders, mockParams)

    expect(mockLoggerInfo).toHaveBeenCalledWith("spine request duration", {"spine_duration": expect.any(Number)})
  })

  test("log response time on unsuccessful call", async () => {
    mock.onPost(mockAddress).reply(401)
    const mockLoggerInfo = jest.spyOn(Logger.prototype, "info")
    const spineClient = new LiveSpineClient(logger)

    await expect(spineClient.prescriptionSearch(mockHeaders, mockParams))
      .rejects.toThrow("Request failed with status code 401")

    expect(mockLoggerInfo).toHaveBeenCalledWith("spine request duration", {"spine_duration": expect.any(Number)})
  })

  test.each<spineFailureTestData>([
    {
      httpResponseCode: 200,
      spineStatusCode: "99",
      errorMessage: "Unsuccessful status code response from spine",
      scenarioDescription: "spine returns a non-successful response status"
    },
    {
      httpResponseCode: 500,
      spineStatusCode: "0",
      errorMessage: "Request failed with status code 500",
      scenarioDescription: "spine returns an unsuccessful HTTP status code"
    }
  ])(
    "should throw an error when $scenarioDescription",
    async ({httpResponseCode, spineStatusCode, errorMessage}) => {
      mock.onPost(mockAddress).reply(httpResponseCode, {statusCode: spineStatusCode})
      const spineClient = new LiveSpineClient(logger)

      await expect(spineClient.prescriptionSearch(mockHeaders, mockParams)).rejects.toThrow(errorMessage)
    }
  )

  test("should throw error when unsuccessful http request", async () => {
    const spineClient = new LiveSpineClient(logger)
    mock.onPost(mockAddress).networkError()
    await expect(spineClient.prescriptionSearch(mockHeaders, mockParams)).rejects.toThrow("Network Error")
  })

  test("should throw error when timeout on http request", async () => {
    const spineClient = new LiveSpineClient(logger)
    mock.onPost(mockAddress).timeout()
    await expect(spineClient.prescriptionSearch(mockHeaders, mockParams)).rejects.toThrow("timeout of 45000ms exceeded")
  })

  test("should not throw error when one unsuccessful and one successful http request", async () => {
    mock
      .onPost(mockAddress).networkErrorOnce()
      .onPost(mockAddress).reply(200, mockResponse)

    const mockLoggerWarn = jest.spyOn(Logger.prototype, "warn")

    const spineClient = new LiveSpineClient(logger)

    const spineResponse = await spineClient.prescriptionSearch(mockHeaders, mockParams)

    expect(spineResponse.status).toBe(200)
    expect(spineResponse.data).toStrictEqual(mockResponse)
    expect(mockLoggerWarn).toHaveBeenCalledWith("Call to spine failed - retrying. Retry count 1")
  })

  test("should retry only 3 times when http request errors", async () => {
    mock.onPost(mockAddress).networkError()
    const mockLoggerWarn = jest.spyOn(Logger.prototype, "warn")

    const spineClient = new LiveSpineClient(logger)

    await expect(spineClient.prescriptionSearch(mockHeaders, mockParams)).rejects.toThrow("Network Error")
    expect(mockLoggerWarn).toHaveBeenCalledWith("Call to spine failed - retrying. Retry count 1")
    expect(mockLoggerWarn).toHaveBeenCalledWith("Call to spine failed - retrying. Retry count 2")
    expect(mockLoggerWarn).toHaveBeenCalledWith("Call to spine failed - retrying. Retry count 3")
    expect(mockLoggerWarn).not.toHaveBeenCalledWith("Call to spine failed - retrying. Retry count 4")
  })
})
