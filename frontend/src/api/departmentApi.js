import axiosClient from "./axiosClient";

export async function createDepartment(payload) {
    const response = await axiosClient.post("/superadmin/departments", payload);
    return response.data;
}

export async function getAllDepartments() {
    const response = await axiosClient.get("/superadmin/departments");
    return response.data;
}

export async function getDepartmentById(id) {
    const response = await axiosClient.get(`/superadmin/departments/${id}`);
    return response.data;
}

export async function updateDepartment(id, payload) {
    const response = await axiosClient.put(`/superadmin/departments/${id}`, payload);
    return response.data;
}

export async function deleteDepartment(id) {
    const response = await axiosClient.delete(`/superadmin/departments/${id}`);
    return response.data;
}
