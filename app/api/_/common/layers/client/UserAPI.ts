import "client-only";

import ClientAPI from "@/_/common/services/ClientAPI";
import { AxiosRequestConfig } from "axios";
import {
    UsersPutBody,
    UsersPutResponse,
    UsersPutResponseSchema,
} from "../../schema/users";

const API_URL = "/users";

const ClientUserAPI = {
    put: (
        googleId: string,
        data: UsersPutBody,
        config?: AxiosRequestConfig<UsersPutBody>
    ) =>
        ClientAPI.put<UsersPutResponse>(`${API_URL}/${googleId}`, data, {
            ...config,
            schema: UsersPutResponseSchema,
        }),
};

export default ClientUserAPI;
