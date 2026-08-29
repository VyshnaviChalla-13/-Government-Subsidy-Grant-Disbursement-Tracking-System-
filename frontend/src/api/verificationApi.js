import axiosClient from "./axiosClient";

export async function assignOfficers(applicationId, fieldOfficerId, districtOfficerId) {
    const response = await axiosClient.post(`/verifications/${applicationId}/assign`, null, {
        params: {
            ...(fieldOfficerId && { fieldOfficerId }),
            ...(districtOfficerId && { districtOfficerId }),
        },
    });
    return response.data;
}

export async function reviewVerification(applicationId, stage, action, remarks, rejectionReasonId) {
    const response = await axiosClient.patch(`/verifications/${applicationId}/review`, null, {
        params: {
            stage,
            action,
            ...(remarks && { remarks }),
            ...(rejectionReasonId && { rejectionReasonId }),
        },
    });
    return response.data;
}

export async function getVerificationHistory(applicationId) {
    const response = await axiosClient.get(`/verifications/${applicationId}/history`);
    return response.data;
}

export async function verifyApprove(applicationId, remarks) {
    const response = await axiosClient.patch(`/applications/${applicationId}/verify-approve`, null, {
        params: { ...(remarks && { remarks }) },
    });
    return response.data;
}

export async function verifyReturn(applicationId, remarks) {
    const response = await axiosClient.patch(`/applications/${applicationId}/verify-return`, null, {
        params: { remarks },
    });
    return response.data;
}

export async function verifyReject(applicationId, remarks) {
    const response = await axiosClient.patch(`/applications/${applicationId}/verify-reject`, null, {
        params: { remarks },
    });
    return response.data;
}

export async function fieldApprove(applicationId, remarks) {
    const response = await axiosClient.patch(`/applications/${applicationId}/field-approve`, null, {
        params: { ...(remarks && { remarks }) },
    });
    return response.data;
}

export async function fieldReturn(applicationId, remarks) {
    const response = await axiosClient.patch(`/applications/${applicationId}/field-return`, null, {
        params: { remarks },
    });
    return response.data;
}

export async function fieldReject(applicationId, remarks) {
    const response = await axiosClient.patch(`/applications/${applicationId}/field-reject`, null, {
        params: { remarks },
    });
    return response.data;
}
