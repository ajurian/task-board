import "server-only";

import serverAPI from "@/_/services/serverAPI";
import { AxiosRequestConfig } from "axios";
import {
    AuthSessionGetResponse,
    AuthSessionPostBody,
} from "../../schema/authSession";

const API_URL = "/auth/session";

const ServerAuthSessionAPI = {
    get: (config?: AxiosRequestConfig<{}>) =>
        serverAPI.get<AuthSessionGetResponse>(API_URL, config),
    post: (
        data: AuthSessionPostBody,
        config?: AxiosRequestConfig<AuthSessionPostBody>
    ) => serverAPI.post(API_URL, data, config),
    delete: (config?: AxiosRequestConfig<{}>) =>
        serverAPI.delete(API_URL, config),
};

export default ServerAuthSessionAPI;
