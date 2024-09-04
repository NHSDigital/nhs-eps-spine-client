import {AxiosResponse} from "axios"
import {SpineClient} from "./spine-client"
import {StatusCheckResponse} from "./status"
import fs from "fs"
import path from "path"
import {fileURLToPath} from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLINICAL_CONTENT_VIEW_SANDBOX_RESPONSE =
    fs.readFileSync(path.join(__dirname, "resources/clinicalContentViewTemplate.xml"), "utf8")
      .replace(/\n/g, "\r\n")

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
}
