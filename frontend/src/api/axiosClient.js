import axios from "axios";

// Base URL of the Spring Boot backend. Set VITE_API_BASE_URL in a .env file
// (see .env.example) to point at a different host/port.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach the JWT (if present) to every outgoing request.
axiosClient.interceptors.request.use((config) => {
    let token = localStorage.getItem("token");

    if (token) {
        // Strip any accidental enclosing quotes or spaces
        token = token.replace(/^"(.*)"$/, "$1").trim();
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Centralized response handling: on 401 (expired/invalid credentials) clear stored session
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

        return Promise.reject(error);
    }
);

export default axiosClient;