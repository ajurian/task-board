import "server-only";

import ServerAPI from "@/_/services/ServerAPI";
import { AxiosRequestConfig } from "axios";
import {
    AuthSessionGetResponse,
    AuthSessionPostBody,
} from "../../schema/authSession";

const API_URL = "/auth/session";

const ServerAuthSessionAPI = {
    get: (config?: AxiosRequestConfig<{}>) =>
        ServerAPI.get<AuthSessionGetResponse>(API_URL, config),
    post: (
        data: AuthSessionPostBody,
        config?: AxiosRequestConfig<AuthSessionPostBody>
    ) => ServerAPI.post(API_URL, data, config),
    delete: (config?: AxiosRequestConfig<{}>) =>
        ServerAPI.delete(API_URL, config),
};

export default ServerAuthSessionAPI;
