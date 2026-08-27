import axiosClient from "./axiosClient";

export async function createOfficer(payload) {
    const response = await axiosClient.post("/superadmin/officers", payload);
    return response.data;
}

export async function getAllOfficers() {
    const response = await axiosClient.get("/superadmin/officers");
    return response.data;
}

export async function getOfficerById(id) {
    const response = await axiosClient.get(`/superadmin/officers/${id}`);
    return response.data;
}

export async function updateOfficer(id, payload) {
    const response = await axiosClient.put(`/superadmin/officers/${id}`, payload);
    return response.data;
}

export async function deleteOfficer(id) {
    const response = await axiosClient.delete(`/superadmin/officers/${id}`);
    return response.data;
}
