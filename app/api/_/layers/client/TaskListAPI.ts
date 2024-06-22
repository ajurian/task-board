import "client-only";

import clientAPI from "@/_/services/clientAPI";
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
        clientAPI.get<TaskListsGetResponse>(API_URL, {
            ...config,
            schema: TaskListsGetResponseSchema,
        }),
    post: (
        data: TaskListsPostBody,
        config?: AxiosRequestConfig<TaskListsPostBody>
    ) =>
        clientAPI.post<TaskListsPostResponse>(API_URL, data, {
            ...config,
            schema: TaskListsPostResponseSchema,
        }),
    get: (id: string, config?: AxiosRequestConfig<{}>) =>
        clientAPI.get<TaskListGetResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskListGetResponseSchema,
        }),
    patch: (
        id: string,
        data: TaskListPatchBody,
        config?: AxiosRequestConfig<TaskListPatchBody>
    ) =>
        clientAPI.patch<TaskListPatchResponse>(`${API_URL}/${id}`, data, {
            ...config,
            schema: TaskListPatchResponseSchema,
        }),
    delete: (id: string, config?: AxiosRequestConfig<{}>) =>
        clientAPI.delete<TaskListDeleteResponse>(`${API_URL}/${id}`, {
            ...config,
            schema: TaskListDeleteResponseSchema,
        }),
    reorder: (
        data: TaskListsReorderPostBody,
        config?: AxiosRequestConfig<TaskListsReorderPostBody>
    ) => clientAPI.post(`${API_URL}/reorder`, data, config),
};

export default ClientTaskListAPI;
