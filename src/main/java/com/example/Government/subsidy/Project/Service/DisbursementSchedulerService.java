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
import java.util.List;

/**
 * Task 2 - Compliance Tracking, Reminder Automation & Non-Compliance Flagging.
 *
 * Both jobs below are idempotent by construction:
 *  - the reminder job only ever looks at PENDING milestones and checks
 *    NotificationRepository for an existing row (milestone + today +
 *    type) before inserting, so running it twice in one day never
 *    creates a duplicate reminder;
 *  - the overdue job only ever looks at PENDING milestones (once a
 *    milestone is flagged OVERDUE it drops out of that query), so
 *    running it twice never re-flags the same milestone or writes a
 *    second audit_log row for it.
 */
@Service
public class DisbursementSchedulerService {

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_OVERDUE = "OVERDUE";
    private static final String NOTIFICATION_TYPE_UPCOMING = "UPCOMING_DUE";

    @Autowired private ApplicationMilestoneRepository applicationMilestoneRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    /** Every day at 9 AM: notify beneficiaries whose stage is due within the next 3 days. */
    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public String sendUpcomingReminders() {
        LocalDate today = LocalDate.now();
        LocalDate windowEnd = today.plusDays(3);

        List<ApplicationMilestone> dueSoon = applicationMilestoneRepository
                .findByStatusAndDueDateBetween(STATUS_PENDING, today, windowEnd);

        int created = 0;
        for (ApplicationMilestone am : dueSoon) {
            boolean alreadySent = notificationRepository
                    .existsByApplicationMilestone_ApplicationMilestoneIdAndNotificationDateAndType(
                            am.getApplicationMilestoneId(), today, NOTIFICATION_TYPE_UPCOMING);
            if (alreadySent) {
                continue;
            }

            Notification n = new Notification();
            n.setApplicationMilestone(am);
            n.setUser(am.getApplication() != null ? am.getApplication().getBeneficiary() : null);
            n.setType(NOTIFICATION_TYPE_UPCOMING);
            n.setMessage("Your milestone \"" + milestoneName(am) + "\" is due on " + am.getDueDate()
                    + ". Please complete it on time to avoid a compliance flag.");
            n.setNotificationDate(today);
            notificationRepository.save(n);
            created++;
        }

        return "Reminder scheduler ran: " + created + " notification(s) created out of "
                + dueSoon.size() + " milestone(s) due within 3 days";
    }

    /** Every day at 10 AM: flag PENDING stages whose due date has already passed as OVERDUE. */
    @Scheduled(cron = "0 0 10 * * *")
    @Transactional
    public String flagOverdueMilestones() {
        LocalDate today = LocalDate.now();

        List<ApplicationMilestone> overdue = applicationMilestoneRepository
                .findByStatusAndDueDateBefore(STATUS_PENDING, today);

        for (ApplicationMilestone am : overdue) {
            am.setStatus(STATUS_OVERDUE);
            applicationMilestoneRepository.save(am);

            AuditLog log = new AuditLog();
            log.setAction("MILESTONE_OVERDUE");
            log.setEntityType("APPLICATION_MILESTONE");
            log.setEntityId(am.getApplicationMilestoneId());
            log.setPerformedBy("SYSTEM");
            log.setDetails("Milestone due date " + am.getDueDate() + " passed without completion");
            auditLogRepository.save(log);
        }

        return "Overdue scheduler ran: " + overdue.size() + " milestone(s) flagged OVERDUE";
    }

    private String milestoneName(ApplicationMilestone am) {
        return am.getMilestone() != null ? am.getMilestone().getMilestoneName() : "Milestone";
    }
}
