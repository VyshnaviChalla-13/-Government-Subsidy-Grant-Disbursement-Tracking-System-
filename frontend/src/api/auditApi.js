import axiosClient from "./axiosClient";

export async function getAllAuditLogs() {
    const response = await axiosClient.get("/audit-logs");
    return response.data;
}

export async function getAuditLogsForEntity(entityType, entityId) {
    const response = await axiosClient.get("/audit-logs/entity", {
        params: { entityType, entityId },
    });
    return response.data;
}
