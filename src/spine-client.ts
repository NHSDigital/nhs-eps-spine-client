import {Logger} from "@aws-lambda-powertools/logger"
import {ClinicalViewParams, PrescriptionSearchParams, LiveSpineClient} from "./live-spine-client"
import {SandboxSpineClient} from "./sandbox-spine-client"
import {AxiosResponse} from "axios"
import {StatusCheckResponse} from "./status"

export interface SpineStatus {
  status: string
  message?: string
  spineStatus?: StatusCheckResponse
}

export interface SpineClient {
  getStatus(): Promise<SpineStatus>
  getPrescriptions(inboundHeaders: Record<string, string>): Promise<AxiosResponse>
  isCertificateConfigured(): boolean
  clinicalView(
    inboundHeaders: Record<string, string>,
    params: ClinicalViewParams
  ): Promise<AxiosResponse>
  prescriptionSearch(
    inboundHeaders: Record<string, string>,
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
