import "client-only";

import clientAPI from "@/_/services/clientAPI";
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

const ClientTaskBoardAPI = {
    getAll: (config?: AxiosRequestConfig<{}>) =>
        clientAPI.get<TaskBoardsGetResponse>(API_URL, {
            ...config,
            schema: TaskBoardsGetResponseSchema,
        }),
    post: (
        data: TaskBoardsPostBody,
        config?: AxiosRequestConfig<TaskBoardsPostBody>
    ) =>
        clientAPI.post<TaskBoardsPostResponse>(API_URL, data, {
            ...config,
            schema: TaskBoardsPostResponseSchema,
        }),
    get: (id: string, config?: AxiosRequestConfig<{}>) =>
        clientAPI.get<TaskBoardGetResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskBoardGetResponseSchema,
        }),
    patch: (
        id: string,
        data: TaskBoardPatchBody,
        config?: AxiosRequestConfig<TaskBoardPatchBody>
    ) =>
        clientAPI.patch<TaskBoardPatchResponse>(`${API_URL}/${id}`, data, {
            ...config,
            schema: TaskBoardPatchResponseSchema,
        }),
    delete: (id: string, config?: AxiosRequestConfig<{}>) =>
        clientAPI.delete<TaskBoardDeleteResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskBoardDeleteResponseSchema,
        }),
};

export default ClientTaskBoardAPI;
