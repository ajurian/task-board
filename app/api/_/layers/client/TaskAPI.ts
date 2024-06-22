import "client-only";

import clientAPI from "@/_/services/clientAPI";
import { AxiosRequestConfig } from "axios";
import {
    TaskDeleteResponse,
    TaskDeleteResponseSchema,
    TaskGetResponse,
    TaskGetResponseSchema,
    TaskPatchBody,
    TaskPatchResponse,
    TaskPatchResponseSchema,
    TasksGetResponse,
    TasksGetResponseSchema,
    TasksPostBody,
    TasksPostResponse,
    TasksPostResponseSchema,
    TasksReorderPostBody,
} from "../../schema/tasks";

const API_URL = "/tasks";

const ClientTaskAPI = {
    getAll: (config?: AxiosRequestConfig<{}>) =>
        clientAPI.get<TasksGetResponse>(API_URL, {
            ...config,
            schema: TasksGetResponseSchema,
        }),
    post: (data: TasksPostBody, config?: AxiosRequestConfig<TasksPostBody>) =>
        clientAPI.post<TasksPostResponse>(API_URL, data, {
            ...config,
            schema: TasksPostResponseSchema,
        }),
    get: (id: string, config?: AxiosRequestConfig<{}>) =>
        clientAPI.get<TaskGetResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskGetResponseSchema,
        }),
    patch: (
        id: string,
        data: TaskPatchBody,
        config?: AxiosRequestConfig<TaskPatchBody>
    ) =>
        clientAPI.patch<TaskPatchResponse>(`${API_URL}/${id}`, data, {
            ...config,
            schema: TaskPatchResponseSchema,
        }),
    delete: (id: string, config?: AxiosRequestConfig<{}>) =>
        clientAPI.delete<TaskDeleteResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskDeleteResponseSchema,
        }),
    reorder: (
        data: TasksReorderPostBody,
        config?: AxiosRequestConfig<TasksReorderPostBody>
    ) => clientAPI.post(`${API_URL}/reorder`, data, config),
};

export default ClientTaskAPI;
