import axios from "axios";

const clientAPI = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api`,
});

clientAPI.interceptors.response.use((response) => {
    const { config } = response;

    if (config.schema) {
        response.data = config.schema.parse(response.data);
    }

    return response;
});

export default clientAPI;
