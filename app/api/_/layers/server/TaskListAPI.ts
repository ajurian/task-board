import ServerAPI from "@/_/services/ServerAPI";
import { AxiosRequestConfig } from "axios";
import {
    TaskListDeleteResponse,
    TaskListDeleteResponseSchema,
    TaskListGetResponse,
    TaskListGetResponseSchema,
    TaskListPatchBody,
    TaskListPatchResponse,
    TaskListPatchResponseSchema,
    TaskListsGetResponse,
    TaskListsGetResponseSchema,
    TaskListsPostBody,
    TaskListsPostResponse,
    TaskListsPostResponseSchema,
    TaskListsReorderPostBody,
} from "../../schema/taskLists";

const API_URL = "/taskLists";

const ServerTaskListAPI = {
    getAll: (config?: AxiosRequestConfig<{}>) =>
        ServerAPI.get<TaskListsGetResponse>(API_URL, {
            ...config,
            schema: TaskListsGetResponseSchema,
        }),
    post: (
        data: TaskListsPostBody,
        config?: AxiosRequestConfig<TaskListsPostBody>
    ) =>
        ServerAPI.post<TaskListsPostResponse>(API_URL, data, {
            ...config,
            schema: TaskListsPostResponseSchema,
        }),
    get: (id: string, config?: AxiosRequestConfig<{}>) =>
        ServerAPI.get<TaskListGetResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskListGetResponseSchema,
        }),
    patch: (
        id: string,
        data: TaskListPatchBody,
        config?: AxiosRequestConfig<TaskListPatchBody>
    ) =>
        ServerAPI.patch<TaskListPatchResponse>(`${API_URL}/${id}`, data, {
            ...config,
            schema: TaskListPatchResponseSchema,
        }),
    delete: (id: string, config?: AxiosRequestConfig<{}>) =>
        ServerAPI.delete<TaskListDeleteResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskListDeleteResponseSchema,
        }),
    reorder: (
        data: TaskListsReorderPostBody,
        config?: AxiosRequestConfig<TaskListsReorderPostBody>
    ) => ServerAPI.post(`${API_URL}/reorder`, data, config),
};

export default ServerTaskListAPI;
