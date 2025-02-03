import { serviceHealthCheck } from "./status";
import { Agent } from "https";
import axios from "axios";
import axiosRetry from "axios-retry";
import { handleCallError, handleErrorResponse } from "./utils";
import Mustache from "mustache";
import CLINICAL_CONTENT_VIEW_TEMPLATE from "./resources/clinical_content_view";
import PRESCRIPTION_SEARCH_TEMPLATE from "./resources/prescription_search";
// timeout in ms to wait for response from spine to avoid lambda timeout
const SPINE_TIMEOUT = 45000;
// Clinical Content View Globals
const CLINICAL_VIEW_REQUEST_PATH = "syncservice-pds/pds";
// Prescription Search Globals
const PRESCRIPTION_SEARCH_REQUEST_PATH = "syncservice-pds/pds";
export class LiveSpineClient {
    constructor(logger) {
        this.SPINE_URL_SCHEME = "https";
        this.SPINE_ENDPOINT = process.env.TargetSpineServer;
        this.onAxiosRetry = (retryCount, error) => {
            this.logger.warn(error);
            this.logger.warn(`Call to spine failed - retrying. Retry count ${retryCount}`);
        };
        this.spineASID = process.env.SpineASID;
        this.spinePartyKey = process.env.SpinePartyKey;
        this.httpsAgent = new Agent({
            cert: process.env.SpinePublicCertificate,
            key: process.env.SpinePrivateKey,
            ca: process.env.SpineCAChain,
            keepAlive: true
        });
        this.logger = logger;
        this.axiosInstance = axios.create();
        axiosRetry(this.axiosInstance, {
            retries: 3,
            onRetry: this.onAxiosRetry,
            // Force retry on post requests with non-timeout errors
            retryCondition: (error) => error.code !== "ECONNABORTED"
        });
        this.axiosInstance.interceptors.request.use((config) => {
            config.headers["request-startTime"] = new Date().getTime();
            return config;
        });
        this.axiosInstance.interceptors.response.use((response) => {
            const currentTime = new Date().getTime();
            const startTime = response.config.headers["request-startTime"];
            this.logger.info("spine request duration", { spine_duration: currentTime - startTime });
            return response;
        }, (error) => {
            const currentTime = new Date().getTime();
            const startTime = error.config?.headers["request-startTime"];
            this.logger.info("spine request duration", { spine_duration: currentTime - startTime });
            return Promise.reject(error);
        });
    }
    async getPrescriptions(inboundHeaders) {
        try {
            const address = this.getSpineEndpoint("mm/patientfacingprescriptions");
            // nhsd-nhslogin-user looks like P9:9912003071
            const outboundHeaders = {
                Accept: "application/json",
                "Spine-From-Asid": this.spineASID,
                "nhsd-party-key": this.spinePartyKey,
                nhsNumber: inboundHeaders["nhsNumber"],
                "nhsd-correlation-id": inboundHeaders["nhsd-correlation-id"],
                "nhsd-nhslogin-user": inboundHeaders["nhsd-nhslogin-user"],
                "x-request-id": inboundHeaders["x-request-id"],
                "x-correlation-id": inboundHeaders["x-correlation-id"],
                "nhsd-request-id": inboundHeaders["nhsd-request-id"]
            };
            const queryParams = {
                format: "trace-summary"
            };
            this.logger.info(`making request to ${address}`);
            const response = await this.axiosInstance.get(address, {
                headers: outboundHeaders,
                params: queryParams,
                httpsAgent: this.httpsAgent,
                timeout: SPINE_TIMEOUT
            });
            handleErrorResponse(this.logger, response);
            return response;
        }
        catch (error) {
            handleCallError(this.logger, error);
        }
    }
    getSpineEndpoint(requestPath) {
        return `${this.SPINE_URL_SCHEME}://${this.SPINE_ENDPOINT}/${requestPath}`;
    }
    async getStatus() {
        if (!this.isCertificateConfigured()) {
            return { status: "pass", message: "Spine certificate is not configured" };
        }
        const axiosConfig = { timeout: 20000 };
        let endpoint;
        if (process.env.healthCheckUrl === undefined) {
            axiosConfig.httpsAgent = this.httpsAgent;
            endpoint = this.getSpineEndpoint("healthcheck");
        }
        else {
            axiosConfig.httpsAgent = new Agent();
            endpoint = process.env.healthCheckUrl;
        }
        const spineStatus = await serviceHealthCheck(endpoint, this.logger, axiosConfig, this.axiosInstance);
        return { status: spineStatus.status, spineStatus: spineStatus };
    }
    isCertificateConfigured() {
        // Check if the required certificate-related environment variables are defined
        return (process.env.SpinePublicCertificate !== "ChangeMe" &&
            process.env.SpinePrivateKey !== "ChangeMe" &&
            process.env.SpineCAChain !== "ChangeMe");
    }
    async clinicalView(inboundHeaders, params) {
        try {
            const address = this.getSpineEndpoint(CLINICAL_VIEW_REQUEST_PATH);
            const outboundHeaders = {
                "nhsd-correlation-id": inboundHeaders["nhsd-correlation-id"],
                "nhsd-request-id": inboundHeaders["nhsd-request-id"],
                "x-request-id": inboundHeaders["x-request-id"],
                "x-correlation-id": inboundHeaders["x-correlation-id"],
                "SOAPAction": "urn:nhs:names:services:mmquery/QURX_IN000005UK98"
            };
            const partials = {
                messageGUID: params.requestId,
                toASID: this.spineASID,
                fromASID: this.spineASID,
                creationTime: new Date().getTime().toString(),
                agentPersonSDSRoleProfileId: params.sdsRoleProfileId,
                agentPersonSDSId: params.sdsId,
                agentPersonJobRoleCode: params.jobRoleCode,
                organizationId: params.organizationId,
                prescriptionId: params.prescriptionId,
                repeatNumber: params.repeatNumber ?? ""
            };
            const requestBody = Mustache.render(CLINICAL_CONTENT_VIEW_TEMPLATE, partials);
            this.logger.info(`making request to ${address}`);
            const response = await this.axiosInstance.post(address, requestBody, {
                headers: outboundHeaders,
                httpsAgent: this.httpsAgent,
                timeout: SPINE_TIMEOUT
            });
            handleErrorResponse(this.logger, response);
            return response;
        }
        catch (error) {
            handleCallError(this.logger, error);
        }
    }
    async prescriptionSearch(inboundHeaders, params) {
        try {
            const address = this.getSpineEndpoint(PRESCRIPTION_SEARCH_REQUEST_PATH);
            const outboundHeaders = {
                "nhsd-correlation-id": inboundHeaders["nhsd-correlation-id"],
                "nhsd-request-id": inboundHeaders["nhsd-request-id"],
                "x-request-id": inboundHeaders["x-request-id"],
                "x-correlation-id": inboundHeaders["x-correlation-id"],
                "SOAPAction": "urn:nhs:names:services:mmquery/PRESCRIPTIONSEARCH_SM01"
            };
            const partials = {
                messageGUID: params.requestId,
                toASID: this.spineASID,
                fromASID: this.spineASID,
                creationTime: new Date().getTime().toString(),
                agentPersonSDSRoleProfileId: params.sdsRoleProfileId,
                agentPersonSDSId: params.sdsId,
                agentPersonJobRoleCode: params.jobRoleCode,
                prescriptionId: params.prescriptionId,
                nhsNumber: params.nhsNumber,
                dispenserOrg: params.dispenserOrg,
                prescriberOrg: params.prescriberOrg,
                releaseVersion: params.releaseVersion,
                prescriptionStatus: params.prescriptionStatus,
                prescriptionStatus1: params.prescriptionStatus1,
                prescriptionStatus2: params.prescriptionStatus2,
                prescriptionStatus3: params.prescriptionStatus3,
                creationDateRange: params.creationDateRange,
                mySiteOrganisation: params.mySiteOrganisation
            };
            const requestBody = Mustache.render(PRESCRIPTION_SEARCH_TEMPLATE, partials);
            this.logger.info(`Making request to ${address}`);
            const response = await this.axiosInstance.post(address, requestBody, {
                headers: outboundHeaders,
                httpsAgent: this.httpsAgent,
                timeout: SPINE_TIMEOUT
            });
            handleErrorResponse(this.logger, response);
            return response;
        }
        catch (error) {
            handleCallError(this.logger, error);
        }
    }
}
//# sourceMappingURL=live-spine-client.js.map
