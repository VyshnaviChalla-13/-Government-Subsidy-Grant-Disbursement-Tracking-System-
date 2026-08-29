import axiosClient from "./axiosClient";

export async function createScheme(payload) {
    const response = await axiosClient.post("/departmentadmin/schemes", payload);

    return response.data;
}

export async function getAllSchemes() {
    const response = await axiosClient.get("/departmentadmin/schemes/all");

    return response.data;
}

export async function getSchemeById(schemeId) {
    const response = await axiosClient.get(`/departmentadmin/schemes/${schemeId}`);

    return response.data;
}

export async function updateScheme(schemeId, payload) {
    const response = await axiosClient.put(
        `/departmentadmin/schemes/${schemeId}`,
        payload
    );

    return response.data;
}

export async function deleteScheme(schemeId) {
    const response = await axiosClient.delete(`/departmentadmin/schemes/${schemeId}`);

    return response.data;
}

