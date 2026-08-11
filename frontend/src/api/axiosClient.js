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
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Centralized response handling: on 401/403 clear the stored session so the
// UI can bounce the user back to login instead of showing broken pages.
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

        return Promise.reject(error);
    }
);

export default axiosClient;