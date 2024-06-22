import "client-only";

import clientAPI from "@/_/services/clientAPI";
import { AxiosRequestConfig } from "axios";
import {
    AuthSessionGetResponse,
    AuthSessionPostBody,
} from "../../schema/authSession";

const API_URL = "/auth/session";

const ClientAuthSessionAPI = {
    get: (config?: AxiosRequestConfig<{}>) =>
        clientAPI.get<AuthSessionGetResponse>(API_URL, config),
    post: (
        data: AuthSessionPostBody,
        config?: AxiosRequestConfig<AuthSessionPostBody>
    ) => clientAPI.post(API_URL, data, config),
    delete: (config?: AxiosRequestConfig<{}>) =>
        clientAPI.delete(API_URL, config),
};

export default ClientAuthSessionAPI;
