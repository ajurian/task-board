import "client-only";

import getCurrentURL from "@/_/utils/getCurrentURL";
import axios from "axios";

const ClientAPI = axios.create({
    baseURL: `${getCurrentURL()}/api`,
});

ClientAPI.interceptors.response.use((response) => {
    const { config } = response;

    if (config.schema) {
        response.data = config.schema.parse(response.data);
    }

    return response;
});

export default ClientAPI;
