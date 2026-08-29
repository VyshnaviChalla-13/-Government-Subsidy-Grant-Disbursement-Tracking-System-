import axiosClient from "./axiosClient";

export async function getUserNotifications(userId) {
    const response = await axiosClient.get(`/notifications/user/${userId}`);
    return response.data;
}

export async function getUnreadNotifications(userId) {
    const response = await axiosClient.get(`/notifications/user/${userId}/unread`);
    return response.data;
}

export async function getUnreadCount(userId) {
    const response = await axiosClient.get(`/notifications/user/${userId}/count`);
    return response.data;
}

export async function markAsRead(notificationId) {
    const response = await axiosClient.put(`/notifications/${notificationId}/read`);
    return response.data;
}

export const markNotificationAsRead = markAsRead;
