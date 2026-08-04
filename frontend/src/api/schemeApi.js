import axiosClient from "./axiosClient";

export async function createScheme(payload) {
    const response = await axiosClient.post("/superadmin/schemes", payload);

    return response.data;
}

export async function getAllSchemes() {
    const response = await axiosClient.get("/superadmin/schemes");

    return response.data;
}

export async function getSchemeById(schemeId) {
    const response = await axiosClient.get(`/superadmin/schemes/${schemeId}`);

    return response.data;
}

export async function updateScheme(schemeId, payload) {
    const response = await axiosClient.put(
        `/superadmin/schemes/${schemeId}`,
        payload
    );

    return response.data;
}

export async function deleteScheme(schemeId) {
    const response = await axiosClient.delete(`/superadmin/schemes/${schemeId}`);

    return response.data;
}
