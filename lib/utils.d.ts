import { Logger } from "@aws-lambda-powertools/logger";
import { AxiosResponse } from "axios";
export declare function handleErrorResponse(logger: Logger, response: AxiosResponse): void;
export declare function handleCallError(logger: Logger, error: unknown): void;
