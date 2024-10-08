import {Logger} from "@aws-lambda-powertools/logger"
import {ClinicalViewParams, PrescriptionSearchParams, LiveSpineClient} from "./live-spine-client"
import {SandboxSpineClient} from "./sandbox-spine-client"
import {APIGatewayProxyEventHeaders} from "aws-lambda"
import {AxiosResponse} from "axios"
import {StatusCheckResponse} from "./status"

export interface SpineStatus {
  status: string
  message?: string
  spineStatus?: StatusCheckResponse
}

export interface SpineClient {
  getStatus(): Promise<SpineStatus>
  getPrescriptions(inboundHeaders: APIGatewayProxyEventHeaders): Promise<AxiosResponse>
  isCertificateConfigured(): boolean
  clinicalView(
    inboundHeaders: APIGatewayProxyEventHeaders,
    params: ClinicalViewParams
  ): Promise<AxiosResponse>
  prescriptionSearch(
    inboundHeaders: APIGatewayProxyEventHeaders,
    params: PrescriptionSearchParams
  ): Promise<AxiosResponse>
}

export function createSpineClient(logger: Logger): SpineClient {
  const liveMode = process.env.TargetSpineServer !== "sandbox"
  if(liveMode) {
    return new LiveSpineClient(logger)
  } else {
    return new SandboxSpineClient()
  }
}
