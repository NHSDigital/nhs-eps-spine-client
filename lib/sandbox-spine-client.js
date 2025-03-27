import CLINICAL_CONTENT_VIEW_SANDBOX_RESPONSE from "./resources/clinical_content_view_sandbox";
import PRESCRIPTION_SEARCH_SANDBOX_RESPONSE from "./resources/prescription_search_sandbox";
export class SandboxSpineClient {
    async getStatus() {
        return {
            status: "pass",
            timeout: "false",
            responseCode: 200
        };
    }
    async getPrescriptions() {
        // This is not implemented as sandbox lambda does not use this code
        throw new Error("INTERACTION_NOT_SUPPORTED_BY_SANDBOX");
    }
    isCertificateConfigured() {
        // In the sandbox environment, assume the certificate is always configured
        return true;
    }
    async clinicalView() {
        const response = {
            data: CLINICAL_CONTENT_VIEW_SANDBOX_RESPONSE,
            status: 200,
            statusText: "OK"
        };
        return Promise.resolve(response);
    }
    async prescriptionSearch() {
        const response = {
            data: PRESCRIPTION_SEARCH_SANDBOX_RESPONSE,
            status: 200,
            statusText: "OK"
        };
        return Promise.resolve(response);
    }
}
//# sourceMappingURL=sandbox-spine-client.js.map
