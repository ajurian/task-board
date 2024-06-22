import serverAPI from "@/_/services/serverAPI";
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

const ServerTaskAPI = {
    getAll: (config?: AxiosRequestConfig<{}>) =>
        serverAPI.get<TasksGetResponse>(API_URL, {
            ...config,
            schema: TasksGetResponseSchema,
        }),
    post: (data: TasksPostBody, config?: AxiosRequestConfig<TasksPostBody>) =>
        serverAPI.post<TasksPostResponse>(API_URL, data, {
            ...config,
            schema: TasksPostResponseSchema,
        }),
    get: (id: string, config?: AxiosRequestConfig<{}>) =>
        serverAPI.get<TaskGetResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskGetResponseSchema,
        }),
    patch: (
        id: string,
        data: TaskPatchBody,
        config?: AxiosRequestConfig<TaskPatchBody>
    ) =>
        serverAPI.patch<TaskPatchResponse>(`${API_URL}/${id}`, data, {
            ...config,
            schema: TaskPatchResponseSchema,
        }),
    delete: (id: string, config?: AxiosRequestConfig<{}>) =>
        serverAPI.delete<TaskDeleteResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskDeleteResponseSchema,
        }),
    reorder: (
        data: TasksReorderPostBody,
        config?: AxiosRequestConfig<TasksReorderPostBody>
    ) => serverAPI.post(`${API_URL}/reorder`, data, config),
};

export default ServerTaskAPI;
