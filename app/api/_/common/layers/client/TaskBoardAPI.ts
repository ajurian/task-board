import "client-only";

import ClientAPI from "@/_/common/services/ClientAPI";
import { AxiosRequestConfig } from "axios";
import {
    TaskBoardChangeAccessBody,
    TaskBoardChangeAccessResponse,
    TaskBoardChangeAccessResponseSchema,
    TaskBoardDeleteResponse,
    TaskBoardDeleteResponseSchema,
    TaskBoardGetResponse,
    TaskBoardGetResponseSchema,
    TaskBoardPatchBody,
    TaskBoardPatchResponse,
    TaskBoardPatchResponseSchema,
    TaskBoardRequestAccessBody,
    TaskBoardRequestAccessResponse,
    TaskBoardRequestAccessResponseSchema,
    TaskBoardRequestShareAccessBody,
    TaskBoardRequestShareAccessResponse,
    TaskBoardsGetResponse,
    TaskBoardsGetResponseSchema,
    TaskBoardShareAccessBody,
    TaskBoardShareAccessResponse,
    TaskBoardShareAccessResponseSchema,
    TaskBoardsPostBody,
    TaskBoardsPostResponse,
    TaskBoardsPostResponseSchema,
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
    requestAccess: (
        id: string,
        data: TaskBoardRequestAccessBody,
        config?: AxiosRequestConfig<TaskBoardRequestAccessBody>
    ) =>
        ClientAPI.post<TaskBoardRequestAccessResponse>(
            `${API_URL}/${id}/requestAccess`,
            data,
            {
                ...config,
                schema: TaskBoardRequestAccessResponseSchema,
            }
        ),
    shareAccess: (
        id: string,
        data: TaskBoardShareAccessBody,
        config?: AxiosRequestConfig<TaskBoardShareAccessBody>
    ) =>
        ClientAPI.post<TaskBoardShareAccessResponse>(
            `${API_URL}/${id}/shareAccess`,
            data,
            {
                ...config,
                schema: TaskBoardShareAccessResponseSchema,
            }
        ),
    requestShareAccess: (
        id: string,
        data: TaskBoardRequestShareAccessBody,
        config?: AxiosRequestConfig<TaskBoardShareAccessBody>
    ) =>
        ClientAPI.post<TaskBoardRequestShareAccessResponse>(
            `${API_URL}/${id}/requestShareAccess`,
            data,
            {
                ...config,
                schema: TaskBoardRequestAccessResponseSchema,
            }
        ),
    changeAccess: (
        id: string,
        data: TaskBoardChangeAccessBody,
        config?: AxiosRequestConfig<TaskBoardChangeAccessBody>
    ) =>
        ClientAPI.post<TaskBoardChangeAccessResponse>(
            `${API_URL}/${id}/changeAccess`,
            data,
            {
                ...config,
                schema: TaskBoardChangeAccessResponseSchema,
            }
        ),
};

export default ClientTaskBoardAPI;
