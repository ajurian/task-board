import "client-only";

import ClientAPI from "@/_/services/ClientAPI";
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
    TaskBoardsSyncPostBody,
} from "../../schema/taskBoards";

const API_URL = "/taskBoards";

const ClientTaskBoardAPI = {
    getAll: (config?: AxiosRequestConfig<{}>) =>
        ClientAPI.get<TaskBoardsGetResponse>(API_URL, {
            ...config,
            schema: TaskBoardsGetResponseSchema,
        }),
    post: (
        data: TaskBoardsPostBody,
        config?: AxiosRequestConfig<TaskBoardsPostBody>
    ) =>
        ClientAPI.post<TaskBoardsPostResponse>(API_URL, data, {
            ...config,
            schema: TaskBoardsPostResponseSchema,
        }),
    get: (id: string, config?: AxiosRequestConfig<{}>) =>
        ClientAPI.get<TaskBoardGetResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskBoardGetResponseSchema,
        }),
    patch: (
        id: string,
        data: TaskBoardPatchBody,
        config?: AxiosRequestConfig<TaskBoardPatchBody>
    ) =>
        ClientAPI.patch<TaskBoardPatchResponse>(`${API_URL}/${id}`, data, {
            ...config,
            schema: TaskBoardPatchResponseSchema,
        }),
    delete: (id: string, config?: AxiosRequestConfig<{}>) =>
        ClientAPI.delete<TaskBoardDeleteResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskBoardDeleteResponseSchema,
        }),
    sync: (
        data: TaskBoardsSyncPostBody,
        config?: AxiosRequestConfig<TaskBoardsSyncPostBody>
    ) => ClientAPI.post(`${API_URL}/sync`, data, config),
};

export default ClientTaskBoardAPI;
