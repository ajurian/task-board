import "server-only";

import getCurrentURL from "@/_/utils/getCurrentURL";
import axios from "axios";
import { cookies } from "next/headers";

const ServerAPI = axios.create({
    baseURL: `${getCurrentURL()}/api`,
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
