import "client-only";

import clientAPI from "@/_/services/clientAPI";
import { AxiosRequestConfig } from "axios";
import {
    UsersPostBody,
    UsersPostResponse,
    UsersPostResponseSchema,
} from "../../schema/users";

const API_URL = "/users";

const ClientUserAPI = {
    post: (data: UsersPostBody, config?: AxiosRequestConfig<UsersPostBody>) =>
        clientAPI.post<UsersPostResponse>(API_URL, data, {
            ...config,
            schema: UsersPostResponseSchema,
        }),
};

export default ClientUserAPI;
