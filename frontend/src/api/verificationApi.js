import axiosClient from "./axiosClient";

export const getApplications = async () => {
    const response = await axiosClient.get("/applications/all");
    return response.data;
};

export const approveApplication = async (id, remarks = "") => {
    const response = await axiosClient.patch(
        `/applications/${id}/verify-approve`,
        null,
        {
            params: remarks ? { remarks } : {},
        }
    );

    return response.data;
};

export const returnApplication = async (id, remarks) => {
    const response = await axiosClient.patch(
        `/applications/${id}/verify-return`,
        null,
        {
            params: { remarks },
        }
    );

    return response.data;
};

export const rejectApplication = async (id, remarks) => {
    const response = await axiosClient.patch(
        `/applications/${id}/verify-reject`,
        null,
        {
            params: { remarks },
        }
    );

    return response.data;
};