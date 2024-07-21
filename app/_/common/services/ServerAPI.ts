import "server-only";

import axios from "axios";
import { cookies } from "next/headers";
import { TaskBoardsPostResponseSchema } from "@/api/_/common/schema/taskBoards";

const ServerAPI = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_VERCEL_URL}/api`,
});

ServerAPI.interceptors.request.use(async (config) => {
    config.headers.cookie = cookies().toString();
    return config;
});

ServerAPI.interceptors.response.use((response) => {
    const { config } = response;

    if (config.schema) {
        response.data = config.schema.parse(response.data);
    }

    return response;
});

export default ServerAPI;
