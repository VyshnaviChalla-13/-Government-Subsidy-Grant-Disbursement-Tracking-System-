import axiosClient from "./axiosClient";

export async function loginRequest(mobileNumber, password) {
    const response = await axiosClient.post("/users/login", {
        mobileNumber,
        password,
    });

    const data = response.data;

    if (!data || !data.token) {
        throw new Error("Invalid login response from server");
    }

    return {
        token: data.token,
        userId: data.userId,
        fullName: data.fullName,
        role: data.role,
        mobileNumber: data.mobileNumber,
        email: data.email,
    };
}

export async function registerRequest(payload) {
    const response = await axiosClient.post("/users/register", payload);
    return response.data;
}