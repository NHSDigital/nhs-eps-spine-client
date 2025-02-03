import { AxiosResponse } from "axios";
import { SpineClient } from "./spine-client";
import { StatusCheckResponse } from "./status";
export declare class SandboxSpineClient implements SpineClient {
    getStatus(): Promise<StatusCheckResponse>;
    getPrescriptions(): Promise<AxiosResponse>;
    isCertificateConfigured(): boolean;
    clinicalView(): Promise<AxiosResponse>;
    prescriptionSearch(): Promise<AxiosResponse>;
}
