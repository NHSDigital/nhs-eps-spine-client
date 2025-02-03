export async function serviceHealthCheck(url, logger, axiosConfig, axiosInstance) {
    try {
        logger.info(`making request to ${url}`);
        const response = await axiosInstance.get(url, axiosConfig);
        return {
            status: response.status === 200 ? "pass" : "error",
            timeout: "false",
            responseCode: response.status,
            outcome: response.data,
            links: url
        };
    }
    catch (error) {
        let message;
        if (error instanceof Error)
            message = error.message;
        else
            message = String(error);
        logger.error("Error calling external service for status check: " + message);
        let responseCode;
        const axiosError = error;
        if (axiosError.response === undefined) {
            responseCode = 500;
        }
        else {
            responseCode = axiosError.response.status;
        }
        return {
            status: "error",
            timeout: axiosError.code === "ECONNABORTED" ? "true" : "false",
            responseCode: responseCode,
            outcome: typeof axiosError.response?.data === "string" ? axiosError.response?.data : undefined,
            links: url
        };
    }
}
//# sourceMappingURL=status.js.map
