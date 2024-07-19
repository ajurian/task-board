import "server-only";

import ServerAPI from "@/_/common/services/ServerAPI";
import { AxiosRequestConfig } from "axios";
import {
    TaskBoardUserPatchBody,
    TaskBoardUserPatchResponse,
    TaskBoardUserPatchResponseSchema,
    TaskBoardUsersGetResponse,
    TaskBoardUsersGetResponseManyWithTaskBoardsSchema,
    TaskBoardUsersGetResponseSingleSchema,
} from "../../schema/taskBoardUsers";

const API_URL = "/taskBoardUsers";

const ServerTaskBoardUserAPI = {
    get: (config?: AxiosRequestConfig<{}>) =>
        ServerAPI.get<TaskBoardUsersGetResponse<null>>(API_URL, {
            ...config,
            schema: TaskBoardUsersGetResponseManyWithTaskBoardsSchema,
        }),
    getFromTaskBoard: (id: string, config?: AxiosRequestConfig<{}>) =>
        ServerAPI.get<TaskBoardUsersGetResponse<string>>(API_URL, {
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
};

export default ServerTaskBoardUserAPI;
