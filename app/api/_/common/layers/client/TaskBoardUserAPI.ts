import "client-only";

import ClientAPI from "@/_/common/services/ClientAPI";
import { AxiosRequestConfig } from "axios";
import {
    TaskBoardUserDeleteResponse,
    TaskBoardUserDeleteResponseSchema,
    TaskBoardUserPatchBody,
    TaskBoardUserPatchResponse,
    TaskBoardUserPatchResponseSchema,
    TaskBoardUsersGetResponse,
    TaskBoardUsersGetResponseManyWithTaskBoardsSchema,
    TaskBoardUsersGetResponseSingleSchema,
} from "../../schema/taskBoardUsers";

const API_URL = "/taskBoardUsers";

const ClientTaskBoardUserAPI = {
    get: (config?: AxiosRequestConfig<{}>) =>
        ClientAPI.get<TaskBoardUsersGetResponse<null>>(API_URL, {
            ...config,
            schema: TaskBoardUsersGetResponseManyWithTaskBoardsSchema,
        }),
    getFromTaskBoard: (id: string, config?: AxiosRequestConfig<{}>) =>
        ClientAPI.get<TaskBoardUsersGetResponse<string>>(API_URL, {
            ...config,
            schema: TaskBoardUsersGetResponseSingleSchema,
            params: { taskBoardId: id },
        }),
    patch: (
        id: string,
        data: TaskBoardUserPatchBody,
        config?: AxiosRequestConfig<TaskBoardUserPatchBody>
    ) =>
        ClientAPI.patch<TaskBoardUserPatchResponse>(`${API_URL}/${id}`, data, {
            ...config,
            schema: TaskBoardUserPatchResponseSchema,
        }),
    delete: (id: string, config?: AxiosRequestConfig<{}>) =>
        ClientAPI.delete<TaskBoardUserDeleteResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskBoardUserDeleteResponseSchema,
        }),
};

export default ClientTaskBoardUserAPI;
