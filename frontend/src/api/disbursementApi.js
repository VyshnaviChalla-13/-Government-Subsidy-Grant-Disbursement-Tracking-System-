import axiosClient from "./axiosClient";

export async function getFinanceQueue() {
    const response = await axiosClient.get("/disbursement/queue");
    return response.data;
}

export async function releaseMilestone(applicationMilestoneId, transactionReference) {
    const response = await axiosClient.post(
        `/disbursement/release/${applicationMilestoneId}`,
        null,
        {
            params: {
                ...(transactionReference && { transactionReference }),
            },
        }
    );
    return response.data;
}

export async function rejectMilestone(milestoneId, reason) {
    const response = await axiosClient.patch(
        `/disbursement/milestones/${milestoneId}/reject`,
        null,
        {
            params: { reason },
        }
    );
    return response.data;
}

export async function getApplicationMilestones(applicationId) {
    const response = await axiosClient.get(`/disbursement/applications/${applicationId}`);
    return response.data;
}

export async function completeMilestone(milestoneId) {
    const response = await axiosClient.patch(`/disbursement/milestone/${milestoneId}/complete`);
    return response.data;
}

export async function resolveOverdueMilestone(milestoneId, reason) {
    const response = await axiosClient.put(
        `/disbursement/milestone/${milestoneId}/resolve`,
        { reason }
    );
    return response.data;
}

export async function getOverdueReport() {
    const response = await axiosClient.get("/reports/overdue");
    return response.data;
}

export async function configurePlan(schemeId, stages) {
    const response = await axiosClient.post(
        `/disbursement/plan/${schemeId}/configure`,
        stages
    );
    return response.data;
}

export async function initApplicationMilestones(applicationId) {
    const response = await axiosClient.post(
        `/disbursement/applications/${applicationId}/init`
    );
    return response.data;
}

export const initMilestones = initApplicationMilestones;
