import ServerAPI from "@/_/services/ServerAPI";
import { AxiosRequestConfig } from "axios";
import {
    UsersPostBody,
    UsersPostResponse,
    UsersPostResponseSchema,
} from "../../schema/users";

const API_URL = "/users";

const ServerUserAPI = {
    post: (data: UsersPostBody, config?: AxiosRequestConfig<UsersPostBody>) =>
        ServerAPI.post<UsersPostResponse>(API_URL, data, {
            ...config,
            schema: UsersPostResponseSchema,
        }),
};

export default ServerUserAPI;
