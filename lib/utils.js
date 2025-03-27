import axios from "axios";
export function handleErrorResponse(logger, response) {
    if (response.data["statusCode"] !== undefined &&
        response.data["statusCode"] !== "1" &&
        response.data["statusCode"] !== "0") {
        logger.error("Unsuccessful status code response from spine", {
            response: {
                data: response.data,
                status: response.status,
                Headers: response.headers
            }
        });
        throw new Error("Unsuccessful status code response from spine");
    }
}
export function handleCallError(logger, error) {
    if (error["config"]) {
        delete error["config"];
    }
    if (axios.isAxiosError(error)) {
        if (error.response) {
            logger.error("error in response from spine", {
                response: {
                    data: error.response.data,
                    status: error.response.status,
                    Headers: error.response.headers
                },
                request: {
                    method: error.request?.path,
                    params: error.request?.params,
                    headers: error.request?.headers,
                    host: error.request?.host
                }
            });
        }
        else if (error.request) {
            logger.error("error in request to spine", {
                method: error.request.method,
                path: error.request.path,
                params: error.request.params,
                headers: error.request.headers,
                host: error.request.host
            });
        }
        else {
            logger.error("general error calling spine", { error });
        }
    }
    else {
        logger.error("general error", { error });
    }
    throw error;
}
//# sourceMappingURL=utils.js.map
