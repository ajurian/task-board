import "client-only";

import ClientAPI from "@/_/common/services/ClientAPI";
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

const ClientTaskListAPI = {
    getAll: (config?: AxiosRequestConfig<{}>) =>
        ClientAPI.get<TaskListsGetResponse>(API_URL, {
            ...config,
            schema: TaskListsGetResponseSchema,
        }),
    post: (
        data: TaskListsPostBody,
        config?: AxiosRequestConfig<TaskListsPostBody>
    ) =>
        ClientAPI.post<TaskListsPostResponse>(API_URL, data, {
            ...config,
            schema: TaskListsPostResponseSchema,
        }),
    get: (id: string, config?: AxiosRequestConfig<{}>) =>
        ClientAPI.get<TaskListGetResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskListGetResponseSchema,
        }),
    patch: (
        id: string,
        data: TaskListPatchBody,
        config?: AxiosRequestConfig<TaskListPatchBody>
    ) =>
        ClientAPI.patch<TaskListPatchResponse>(`${API_URL}/${id}`, data, {
            ...config,
            schema: TaskListPatchResponseSchema,
        }),
    delete: (id: string, config?: AxiosRequestConfig<{}>) =>
        ClientAPI.delete<TaskListDeleteResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskListDeleteResponseSchema,
        }),
    reorder: (
        data: TaskListsReorderPostBody,
        config?: AxiosRequestConfig<TaskListsReorderPostBody>
    ) => ClientAPI.post(`${API_URL}/reorder`, data, config),
};

export default ClientTaskListAPI;
