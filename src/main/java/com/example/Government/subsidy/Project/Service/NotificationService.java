package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.Notification;
import com.example.Government.subsidy.Project.Repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;


    // Create notification
    public Notification createNotification(
            Integer userId,
            String title,
            String message,
            String type,
            Integer applicationId
    ) {

        Notification notification =
                new Notification();

        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setApplicationId(applicationId);
        notification.setRead(false);

        return notificationRepository.save(notification);
    }


    // Get user's notifications
    public List<Notification> getUserNotifications(
            Integer userId
    ) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }


    // Get unread notifications
    public List<Notification> getUnreadNotifications(
            Integer userId
    ) {

        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(
                        userId
                );
    }


    // Count unread notifications
    public long getUnreadCount(
            Integer userId
    ) {

        return notificationRepository
                .countByUserIdAndIsReadFalse(userId);
    }


    // Mark notification as read
    public String markAsRead(
            Long notificationId
    ) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElse(null);

        if (notification == null) {
            return "Notification not found";
        }

        notification.setRead(true);

        notificationRepository.save(notification);

        return "Notification marked as read";
    }
}