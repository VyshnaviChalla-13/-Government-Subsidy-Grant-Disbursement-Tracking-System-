package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.ApplicationMilestone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ApplicationMilestoneRepository extends JpaRepository<ApplicationMilestone, Integer> {

    List<ApplicationMilestone> findByApplication_ApplicationIdOrderByMilestone_MilestoneOrderAsc(Integer applicationId);

    List<ApplicationMilestone> findByStatus(String status);

    List<ApplicationMilestone> findByStatusIn(List<String> statuses);

    // The stage immediately before this one in the same application's plan
    // (milestoneOrder - 1). Used to enforce the sequential release rule.
    Optional<ApplicationMilestone> findByApplication_ApplicationIdAndMilestone_MilestoneOrder(
            Integer applicationId, Integer milestoneOrder);

    // All stages of the same application that come before a given order -
    // used to check "is any earlier stage still OVERDUE".
    List<ApplicationMilestone> findByApplication_ApplicationIdAndMilestone_MilestoneOrderLessThan(
            Integer applicationId, Integer milestoneOrder);

    // Daily reminder scheduler: still-pending stages due within the window.
    List<ApplicationMilestone> findByStatusAndDueDateBetween(String status, LocalDate from, LocalDate to);

    // Daily overdue scheduler: still-pending stages whose due date has passed.
    List<ApplicationMilestone> findByStatusAndDueDateBefore(String status, LocalDate date);

    // Non-compliance report.
    List<ApplicationMilestone> findByStatusOrderByDueDateAsc(String status);

    // Guard used before letting a plan be reconfigured/deleted: if any
    // beneficiary already has stage instances against this scheme's
    // milestone template, wiping the template would orphan them.
    List<ApplicationMilestone> findByMilestone_Scheme_SchemeId(Integer schemeId);
}
