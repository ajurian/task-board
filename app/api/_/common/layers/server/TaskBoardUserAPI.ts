import "server-only";

import ServerAPI from "@/_/common/services/ServerAPI";
import { AxiosRequestConfig } from "axios";
import {
    TaskBoardUserDeleteResponse,
    TaskBoardUserDeleteResponseSchema,
    TaskBoardUserPatchBody,
    TaskBoardUserPatchResponse,
    TaskBoardUserPatchResponseSchema,
    TaskBoardUsersGetResponseManyWithTaskBoards,
    TaskBoardUsersGetResponseManyWithTaskBoardsSchema,
    TaskBoardUsersGetResponseSingle,
    TaskBoardUsersGetResponseSingleSchema,
} from "../../schema/taskBoardUsers";

const API_URL = "/taskBoardUsers";

const ServerTaskBoardUserAPI = {
    get: (config?: AxiosRequestConfig<{}>) =>
        ServerAPI.get<TaskBoardUsersGetResponseManyWithTaskBoards>(API_URL, {
            ...config,
            schema: TaskBoardUsersGetResponseManyWithTaskBoardsSchema,
        }),
    getFromTaskBoard: (id: string, config?: AxiosRequestConfig<{}>) =>
        ServerAPI.get<TaskBoardUsersGetResponseSingle>(API_URL, {
            ...config,
            schema: TaskBoardUsersGetResponseSingleSchema,
            params: { taskBoardId: id },
        }),
    patch: (
        id: string,
        data: TaskBoardUserPatchBody,
        config?: AxiosRequestConfig<TaskBoardUserPatchBody>
    ) =>
        ServerAPI.patch<TaskBoardUserPatchResponse>(`${API_URL}/${id}`, data, {
            ...config,
            schema: TaskBoardUserPatchResponseSchema,
        }),
    delete: (id: string, config?: AxiosRequestConfig<{}>) =>
        ServerAPI.delete<TaskBoardUserDeleteResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskBoardUserDeleteResponseSchema,
        }),
};

export default ServerTaskBoardUserAPI;
