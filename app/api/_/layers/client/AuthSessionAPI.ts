import "client-only";

import ClientAPI from "@/_/services/ClientAPI";
import { AxiosRequestConfig } from "axios";
import {
    AuthSessionGetResponse,
    AuthSessionPostBody,
} from "../../schema/authSession";

const API_URL = "/auth/session";

const ClientAuthSessionAPI = {
    get: (config?: AxiosRequestConfig<{}>) =>
        ClientAPI.get<AuthSessionGetResponse>(API_URL, config),
    post: (
        data: AuthSessionPostBody,
        config?: AxiosRequestConfig<AuthSessionPostBody>
    ) => ClientAPI.post(API_URL, data, config),
    delete: (config?: AxiosRequestConfig<{}>) =>
        ClientAPI.delete(API_URL, config),
};

export default ClientAuthSessionAPI;
