import axiosClient from "./axiosClient";

export async function updateApplicationStatus(applicationId, status, remarks) {
    const response = await axiosClient.patch(
        `/applications/${applicationId}/status`,
        null,
        {
            params: {
                status,
                ...(remarks !== undefined && { remarks }),
            },
        }
    );

    return response.data;
}

export async function submitApplicationDetails(payload) {
    const response = await axiosClient.post("/api/application/submit", payload);

    return response.data;
}

export async function submitApplication(beneficiaryId, schemeId, payload) {
    const response = await axiosClient.post("/applications/submit", payload, {
        params: {
            beneficiaryId,
            schemeId,
        },
    });

    return response.data;
}

export async function getAllApplications() {
    const response = await axiosClient.get("/applications/all");

    return response.data;
}

export async function getMyApplications() {
    const response = await axiosClient.get("/applications/mine");

    return response.data;
}

export async function getApplicationById(applicationId) {
    const response = await axiosClient.get(`/applications/${applicationId}`);

    return response.data;
}

export async function getApplicationMilestones(applicationId) {
    const response = await axiosClient.get(
        `/disbursement/applications/${applicationId}`
    );

    return response.data;
}

export async function resubmitApplication(applicationId, payload) {
    const response = await axiosClient.put(
        `/applications/${applicationId}/resubmit`,
        payload
    );

    return response.data;
}

export async function searchApplications(keyword) {
    const response = await axiosClient.get("/applications/search", {
        params: { keyword },
    });

    return response.data;
}
