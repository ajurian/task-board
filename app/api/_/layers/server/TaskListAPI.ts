import serverAPI from "@/_/services/serverAPI";
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
        serverAPI.get<TaskListsGetResponse>(API_URL, {
            ...config,
            schema: TaskListsGetResponseSchema,
        }),
    post: (
        data: TaskListsPostBody,
        config?: AxiosRequestConfig<TaskListsPostBody>
    ) =>
        serverAPI.post<TaskListsPostResponse>(API_URL, data, {
            ...config,
            schema: TaskListsPostResponseSchema,
        }),
    get: (id: string, config?: AxiosRequestConfig<{}>) =>
        serverAPI.get<TaskListGetResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskListGetResponseSchema,
        }),
    patch: (
        id: string,
        data: TaskListPatchBody,
        config?: AxiosRequestConfig<TaskListPatchBody>
    ) =>
        serverAPI.patch<TaskListPatchResponse>(`${API_URL}/${id}`, data, {
            ...config,
            schema: TaskListPatchResponseSchema,
        }),
    delete: (id: string, config?: AxiosRequestConfig<{}>) =>
        serverAPI.delete<TaskListDeleteResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskListDeleteResponseSchema,
        }),
    reorder: (
        data: TaskListsReorderPostBody,
        config?: AxiosRequestConfig<TaskListsReorderPostBody>
    ) => serverAPI.post(`${API_URL}/reorder`, data, config),
};

export default ServerTaskListAPI;
