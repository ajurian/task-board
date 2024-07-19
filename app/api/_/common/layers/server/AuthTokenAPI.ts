import "server-only";

import ServerAPI from "@/_/common/services/ServerAPI";
import { AxiosRequestConfig } from "axios";
import {
    AuthTokenGetResponse,
    AuthTokenPostBody,
} from "../../schema/authToken";

const API_URL = "/auth/token";

const ServerAuthTokenAPI = {
    get: (config?: AxiosRequestConfig<{}>) =>
        ServerAPI.get<AuthTokenGetResponse>(API_URL, config),
    post: (
        data: AuthTokenPostBody,
        config?: AxiosRequestConfig<AuthTokenPostBody>
    ) => ServerAPI.post(API_URL, data, config),
    delete: (config?: AxiosRequestConfig<{}>) =>
        ServerAPI.delete(API_URL, config),
};

export default ServerAuthTokenAPI;
