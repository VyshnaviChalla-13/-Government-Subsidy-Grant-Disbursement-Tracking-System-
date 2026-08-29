import axiosClient from "./axiosClient";

export async function getSystemOverview() {
    const response = await axiosClient.get("/dashboard/overview");
    return response.data;
}

export async function getSchemeSummary() {
    const response = await axiosClient.get("/dashboard/schemes");
    return response.data;
}

export async function getRegionSummary() {
    const response = await axiosClient.get("/dashboard/regions");
    return response.data;
}

export async function getApprovalPerformance() {
    const response = await axiosClient.get("/dashboard/performance");
    return response.data;
}
