import ServerAPI from "@/_/common/services/ServerAPI";
import { AxiosRequestConfig } from "axios";
import {
    TaskBoardDeleteResponse,
    TaskBoardDeleteResponseSchema,
    TaskBoardGetResponse,
    TaskBoardGetResponseSchema,
    TaskBoardPatchBody,
    TaskBoardPatchResponse,
    TaskBoardPatchResponseSchema,
    TaskBoardsGetResponse,
    TaskBoardsGetResponseSchema,
    TaskBoardsPostBody,
    TaskBoardsPostResponse,
    TaskBoardsPostResponseSchema,
} from "../../schema/taskBoards";

const API_URL = "/taskBoards";

const ServerTaskBoardAPI = {
    getAll: (config?: AxiosRequestConfig<{}>) =>
        ServerAPI.get<TaskBoardsGetResponse>(API_URL, {
            ...config,
            schema: TaskBoardsGetResponseSchema,
        }),
    post: (
        data: TaskBoardsPostBody,
        config?: AxiosRequestConfig<TaskBoardsPostBody>
    ) =>
        ServerAPI.post<TaskBoardsPostResponse>(API_URL, data, {
            ...config,
            schema: TaskBoardsPostResponseSchema,
        }),
    get: (id: string, config?: AxiosRequestConfig<{}>) =>
        ServerAPI.get<TaskBoardGetResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskBoardGetResponseSchema,
        }),
    patch: (
        id: string,
        data: TaskBoardPatchBody,
        config?: AxiosRequestConfig<TaskBoardPatchBody>
    ) =>
        ServerAPI.patch<TaskBoardPatchResponse>(`${API_URL}/${id}`, data, {
            ...config,
            schema: TaskBoardPatchResponseSchema,
        }),
    delete: (id: string, config?: AxiosRequestConfig<{}>) =>
        ServerAPI.delete<TaskBoardDeleteResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskBoardDeleteResponseSchema,
        }),
};

export default ServerTaskBoardAPI;
