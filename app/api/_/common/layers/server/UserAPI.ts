import ServerAPI from "@/_/common/services/ServerAPI";
import { AxiosRequestConfig } from "axios";
import {
    UsersPutBody,
    UsersPutResponse,
    UsersPutResponseSchema,
} from "../../schema/users";

const API_URL = "/users";

const ServerUserAPI = {
    put: (
        email: string,
        data: UsersPutBody,
        config?: AxiosRequestConfig<UsersPutBody>
    ) =>
        ServerAPI.put<UsersPutResponse>(`${API_URL}/${email}`, data, {
            ...config,
            schema: UsersPutResponseSchema,
        }),
};

export default ServerUserAPI;
