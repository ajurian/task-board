import "client-only";

import axios from "axios";

const ClientAPI = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_VERCEL_URL}/api`,
});

ClientAPI.interceptors.response.use((response) => {
    const { config } = response;

    if (config.schema) {
        response.data = config.schema.parse(response.data);
    }

    return response;
});

export default ClientAPI;
