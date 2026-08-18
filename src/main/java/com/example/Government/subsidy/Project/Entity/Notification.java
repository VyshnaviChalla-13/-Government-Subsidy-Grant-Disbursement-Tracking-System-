package com.example.Government.subsidy.Project.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Reminder notification created by the daily 9 AM scheduler for a
 * beneficiary whose milestone is due within the next 3 days.
 *
 * notificationDate is the calendar day the reminder was generated on -
 * used purely to make the scheduler idempotent (one reminder per
 * milestone per day, see Repository#existsByApplicationMilestone...).
 */
@Entity
@Table(
        name = "notifications",
        indexes = {
                @Index(name = "idx_notification_milestone_date", columnList = "application_milestone_id, notification_date"),
                @Index(name = "idx_notification_user", columnList = "user_id")
        }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_milestone_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ApplicationMilestone applicationMilestone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    /** UPCOMING_DUE | OVERDUE */
    @Column(nullable = false, length = 30)
    private String type;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "notification_date", nullable = false)
    private LocalDate notificationDate;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (notificationDate == null) notificationDate = LocalDate.now();
        if (isRead == null) isRead = false;
    }
}
