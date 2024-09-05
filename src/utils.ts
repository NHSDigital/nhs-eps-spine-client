import {Logger} from "@aws-lambda-powertools/logger"
import axios, {AxiosResponse} from "axios"

export function handleErrorResponse(logger: Logger, response: AxiosResponse) {
  if (response.data["statusCode"] !== undefined &&
    response.data["statusCode"] !== "1" &&
    response.data["statusCode"] !== "0") {
    logger.error("Unsuccessful status code response from spine", {
      response: {
        data: response.data,
        status: response.status,
        Headers: response.headers
      }
    })
    throw new Error("Unsuccessful status code response from spine")
  }
}

export function handleCallError(logger: Logger, error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      logger.error("error in response from spine", {
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
      logger.error("error in request to spine", {
        method: error.request.method,
        path: error.request.path,
        params: error.request.params,
        headers: error.request.headers,
        host: error.request.host
      })
    } else {
      logger.error("general error calling spine", {error})
    }
  } else {
    logger.error("general error", {error})
  }
  throw error

}
