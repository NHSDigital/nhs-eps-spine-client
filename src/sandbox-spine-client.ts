import {AxiosResponse} from "axios"
import {SpineClient} from "./spine-client"
import {StatusCheckResponse} from "./status"
import CLINICAL_CONTENT_VIEW_SANDBOX_RESPONSE from "./resources/clinical_content_view_sandbox"
import PRESCRIPTION_SEARCH_SANDBOX_RESPONSE from "./resources/prescription_search_sandbox"

export class SandboxSpineClient implements SpineClient {
  async getStatus(): Promise<StatusCheckResponse> {
    return {
      status: "pass",
      timeout: "false",
      responseCode: 200
    }
  }

  async getPrescriptions(): Promise<AxiosResponse> {
    // This is not implemented as sandbox lambda does not use this code
    throw new Error("INTERACTION_NOT_SUPPORTED_BY_SANDBOX")
  }

  isCertificateConfigured(): boolean {
    // In the sandbox environment, assume the certificate is always configured
    return true
  }

  async clinicalView(): Promise<AxiosResponse> {
    const response: AxiosResponse = {
      data: CLINICAL_CONTENT_VIEW_SANDBOX_RESPONSE,
      status: 200,
      statusText: "OK"
    } as unknown as AxiosResponse
    return Promise.resolve(response)
  }

  async prescriptionSearch(): Promise<AxiosResponse> {
    const response: AxiosResponse = {
      data: PRESCRIPTION_SEARCH_SANDBOX_RESPONSE,
      status: 200,
      statusText: "OK"
    } as unknown as AxiosResponse
    return Promise.resolve(response)
  }
}
