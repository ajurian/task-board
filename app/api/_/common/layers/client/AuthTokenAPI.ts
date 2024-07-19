import "client-only";

import ClientAPI from "@/_/common/services/ClientAPI";
import { AxiosRequestConfig } from "axios";
import {
    AuthTokenGetResponse,
    AuthTokenPostBody,
} from "../../schema/authToken";

const API_URL = "/auth/Token";

const ClientAuthTokenAPI = {
    get: (config?: AxiosRequestConfig<{}>) =>
        ClientAPI.get<AuthTokenGetResponse>(API_URL, config),
    post: (
        data: AuthTokenPostBody,
        config?: AxiosRequestConfig<AuthTokenPostBody>
    ) => ClientAPI.post(API_URL, data, config),
    delete: (config?: AxiosRequestConfig<{}>) =>
        ClientAPI.delete(API_URL, config),
};

export default ClientAuthTokenAPI;
