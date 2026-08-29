package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.ApplicationMilestone;
import com.example.Government.subsidy.Project.Entity.AuditLog;
import com.example.Government.subsidy.Project.Entity.Notification;
import com.example.Government.subsidy.Project.Repository.ApplicationMilestoneRepository;
import com.example.Government.subsidy.Project.Repository.AuditLogRepository;
import com.example.Government.subsidy.Project.Repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DisbursementSchedulerService {

    private static final String STATUS_PENDING = "PENDING";

    private static final String STATUS_OVERDUE = "OVERDUE";

    private static final String NOTIFICATION_TYPE_UPCOMING =
            "UPCOMING_DUE";


    @Autowired
    private ApplicationMilestoneRepository applicationMilestoneRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;


    // =====================================================
    // UPCOMING MILESTONE REMINDERS
    // Every day at 9 AM
    // =====================================================

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public String sendUpcomingReminders() {

        LocalDate today =
                LocalDate.now();

        LocalDate windowEnd =
                today.plusDays(3);

        List<ApplicationMilestone> dueSoon =
                applicationMilestoneRepository
                        .findByStatusAndDueDateBetween(
                                STATUS_PENDING,
                                today,
                                windowEnd
                        );

        int created = 0;

        LocalDateTime startOfDay =
                today.atStartOfDay();

        LocalDateTime endOfDay =
                today.plusDays(1)
                        .atStartOfDay()
                        .minusNanos(1);


        for (ApplicationMilestone am : dueSoon) {

            if (am.getApplication() == null) {
                continue;
            }


            Integer applicationId =
                    am.getApplication()
                            .getApplicationId();

            if (applicationId == null) {
                continue;
            }


            // Prevent duplicate notification
            boolean alreadySent =
                    notificationRepository
                            .existsByApplicationIdAndTypeAndCreatedAtBetween(
                                    applicationId,
                                    NOTIFICATION_TYPE_UPCOMING,
                                    startOfDay,
                                    endOfDay
                            );

            if (alreadySent) {
                continue;
            }


            if (am.getApplication()
                    .getBeneficiary() == null) {

                continue;
            }


            Integer userId =
                    am.getApplication()
                            .getBeneficiary()
                            .getUserId();


            Notification notification =
                    new Notification();

            notification.setUserId(userId);

            notification.setApplicationId(
                    applicationId
            );

            notification.setType(
                    NOTIFICATION_TYPE_UPCOMING
            );

            notification.setTitle(
                    "Upcoming Milestone"
            );

            notification.setMessage(
                    "Your milestone \""
                            + milestoneName(am)
                            + "\" is due on "
                            + am.getDueDate()
                            + ". Please complete it on time "
                            + "to avoid a compliance flag."
            );

            notification.setRead(false);

            notificationRepository.save(
                    notification
            );

            created++;
        }


        return "Reminder scheduler ran: "
                + created
                + " notification(s) created out of "
                + dueSoon.size()
                + " milestone(s) due within 3 days";
    }


    // =====================================================
    // OVERDUE MILESTONE FLAGGING
    // Every day at 10 AM
    // =====================================================

    @Scheduled(cron = "0 0 10 * * *")
    @Transactional
    public String flagOverdueMilestones() {

        LocalDate today =
                LocalDate.now();

        List<ApplicationMilestone> overdue =
                applicationMilestoneRepository
                        .findByStatusAndDueDateBefore(
                                STATUS_PENDING,
                                today
                        );


        for (ApplicationMilestone am : overdue) {

            am.setStatus(
                    STATUS_OVERDUE
            );

            applicationMilestoneRepository.save(
                    am
            );


            AuditLog log =
                    new AuditLog();

            log.setAction(
                    "MILESTONE_OVERDUE"
            );

            log.setEntityType(
                    "APPLICATION_MILESTONE"
            );

            log.setEntityId(
                    am.getApplicationMilestoneId()
            );

            log.setPerformedBy(
                    "SYSTEM"
            );

            log.setDetails(
                    "Milestone due date "
                            + am.getDueDate()
                            + " passed without completion"
            );

            auditLogRepository.save(
                    log
            );
        }


        return "Overdue scheduler ran: "
                + overdue.size()
                + " milestone(s) flagged OVERDUE";
    }


    // =====================================================
    // GET MILESTONE NAME
    // =====================================================

    private String milestoneName(
            ApplicationMilestone am
    ) {

        return am.getMilestone() != null
                ? am.getMilestone()
                .getMilestoneName()
                : "Milestone";
    }
}