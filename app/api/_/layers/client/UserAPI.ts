import "client-only";

import ClientAPI from "@/_/services/ClientAPI";
import { AxiosRequestConfig } from "axios";
import {
    UsersPostBody,
    UsersPostResponse,
    UsersPostResponseSchema,
} from "../../schema/users";

const API_URL = "/users";

const ClientUserAPI = {
    post: (data: UsersPostBody, config?: AxiosRequestConfig<UsersPostBody>) =>
        ClientAPI.post<UsersPostResponse>(API_URL, data, {
            ...config,
            schema: UsersPostResponseSchema,
        }),
};

export default ClientUserAPI;
