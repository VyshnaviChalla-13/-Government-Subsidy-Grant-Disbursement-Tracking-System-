import axiosClient from "./axiosClient";

// Get all applications
export const getApplications = async () => {
    const response = await axiosClient.get("/applications/all");
    return response.data;
};

// Forward application
export const forwardApplication = async (applicationId) => {
    const response = await axiosClient.patch(
        `/applications/${applicationId}/field-approve`
    );
    return response.data;
};

// Return application
export const returnApplication = async (applicationId, remarks) => {
    const response = await axiosClient.patch(
        `/applications/${applicationId}/field-return`,
        null,
        {
            params: { remarks }
        }
    );
    return response.data;
};

// Reject application
export const rejectApplication = async (applicationId, remarks) => {
    const response = await axiosClient.patch(
        `/applications/${applicationId}/field-reject`,
        null,
        {
            params: { remarks }
        }
    );
    return response.data;
};