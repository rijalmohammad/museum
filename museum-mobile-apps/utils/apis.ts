import axios from "axios";

type ProjectMode = 'development' | 'production';
export const projectMode: ProjectMode = 'development';

export default axios.create({
    baseURL: "https://museum-api-gateway-6qu51z4h.uc.gateway.dev/",
    responseType: "json",
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
    }
});

// baseURL: "http://157.24.111.41:3000/",