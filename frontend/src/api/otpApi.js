import axiosClient from "./axiosClient";

export async function forgotPasswordSendOtp(mobileNumber) {
    const response = await axiosClient.post("/otp/forgot-password", null, {
        params: { mobileNumber },
    });
    return response.data;
}

export async function verifyOtp(mobileNumber, otp) {
    const response = await axiosClient.post("/otp/verify", null, {
        params: { mobileNumber, otp },
    });
    return response.data;
}

export async function resetPassword(mobileNumber, newPassword) {
    const response = await axiosClient.post("/otp/reset-password", null, {
        params: { mobileNumber, newPassword },
    });
    return response.data;
}
