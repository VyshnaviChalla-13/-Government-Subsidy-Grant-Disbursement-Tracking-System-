package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Used by the reminder scheduler to stay idempotent: if a reminder
    // already exists for this milestone today, don't create another one.
    boolean existsByApplicationMilestone_ApplicationMilestoneIdAndNotificationDateAndType(
            Integer applicationMilestoneId, LocalDate notificationDate, String type);

    List<Notification> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);
}
