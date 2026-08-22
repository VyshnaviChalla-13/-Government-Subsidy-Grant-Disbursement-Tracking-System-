package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Entity.Notification;
import com.example.Government.subsidy.Project.Service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;


    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(
            @PathVariable Integer userId
    ) {

        return notificationService
                .getUserNotifications(userId);
    }


    @GetMapping("/user/{userId}/unread")
    public List<Notification> getUnreadNotifications(
            @PathVariable Integer userId
    ) {

        return notificationService
                .getUnreadNotifications(userId);
    }


    @GetMapping("/user/{userId}/count")
    public long getUnreadCount(
            @PathVariable Integer userId
    ) {

        return notificationService
                .getUnreadCount(userId);
    }


    @PutMapping("/{notificationId}/read")
    public String markAsRead(
            @PathVariable Long notificationId
    ) {

        return notificationService
                .markAsRead(notificationId);
    }
}