import "server-only";

import axios from "axios";
import { cookies } from "next/headers";

const serverAPI = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api`,
});

serverAPI.interceptors.request.use(async (config) => {
    config.headers.cookie = cookies().toString();
    return config;
});

serverAPI.interceptors.response.use((response) => {
    const { config } = response;

    if (config.schema) {
        response.data = config.schema.parse(response.data);
    }

    return response;
});

export default serverAPI;
