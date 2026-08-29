import axiosClient from "./axiosClient";

export async function getAllUsers() {
    const response = await axiosClient.get("/users/all");

    return response.data;
}

export async function getUserById(userId) {
    const response = await axiosClient.get(`/users/${userId}`);

    return response.data;
}

export async function updateUserById(userId, payload) {
    const response = await axiosClient.put(`/users/update/${userId}`, payload);

    return response.data;
}

export async function deleteUser(userId) {
    const response = await axiosClient.delete(`/users/delete/${userId}`);

    return response.data;
}

export async function getUserNotifications(userId) {
    const response = await axiosClient.get(`/notifications/user/${userId}`);

    return response.data;
}

export async function getUnreadNotifications(userId) {
    const response = await axiosClient.get(`/notifications/user/${userId}/unread`);

    return response.data;
}

export async function getUnreadNotificationCount(userId) {
    const response = await axiosClient.get(`/notifications/user/${userId}/count`);

    return response.data;
}

export async function markNotificationAsRead(notificationId) {
    const response = await axiosClient.put(`/notifications/${notificationId}/read`);

    return response.data;
}
