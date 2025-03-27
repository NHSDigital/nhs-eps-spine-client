import { Logger } from "@aws-lambda-powertools/logger";
import { SpineClient, SpineStatus } from "./spine-client";
import { AxiosResponse } from "axios";
import { APIGatewayProxyEventHeaders } from "aws-lambda";
export interface ClinicalViewParams {
    requestId: string;
    prescriptionId: string;
    organizationId: string;
    repeatNumber?: string;
    sdsRoleProfileId: string;
    sdsId: string;
    jobRoleCode: string;
}
export interface PrescriptionSearchParams {
    requestId: string;
    prescriptionId?: string;
    organizationId: string;
    sdsRoleProfileId: string;
    sdsId: string;
    jobRoleCode: string;
    nhsNumber?: string;
    dispenserOrg?: string;
    prescriberOrg?: string;
    releaseVersion?: string;
    prescriptionStatus?: string;
    prescriptionStatus1?: string;
    prescriptionStatus2?: string;
    prescriptionStatus3?: string;
    creationDateRange?: {
        lowDate?: string;
        highDate?: string;
    };
    mySiteOrganisation?: string;
}
export declare class LiveSpineClient implements SpineClient {
    private readonly SPINE_URL_SCHEME;
    private readonly SPINE_ENDPOINT;
    private readonly spineASID;
    private readonly httpsAgent;
    private readonly spinePartyKey;
    private readonly axiosInstance;
    private readonly logger;
    constructor(logger: Logger);
    getPrescriptions(inboundHeaders: APIGatewayProxyEventHeaders): Promise<AxiosResponse>;
    private getSpineEndpoint;
    getStatus(): Promise<SpineStatus>;
    isCertificateConfigured(): boolean;
    clinicalView(inboundHeaders: APIGatewayProxyEventHeaders, params: ClinicalViewParams): Promise<AxiosResponse>;
    prescriptionSearch(inboundHeaders: APIGatewayProxyEventHeaders, params: PrescriptionSearchParams): Promise<AxiosResponse>;
    onAxiosRetry: (retryCount: any, error: any) => void;
}
