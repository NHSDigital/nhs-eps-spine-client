import { Logger } from "@aws-lambda-powertools/logger";
import { Axios, AxiosRequestConfig } from "axios";
export interface StatusCheckResponse {
    status: "pass" | "warn" | "error";
    timeout: "true" | "false";
    responseCode: number;
    outcome?: string;
    links?: string;
}
export declare function serviceHealthCheck(url: string, logger: Logger, axiosConfig: AxiosRequestConfig, axiosInstance: Axios): Promise<StatusCheckResponse>;
