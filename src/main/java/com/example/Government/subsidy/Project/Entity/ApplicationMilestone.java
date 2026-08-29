package com.example.Government.subsidy.Project.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * A single disbursement stage for one beneficiary's application.
 * This is the "disbursement_milestone" record described in the
 * Milestone 3 guide: one row per stage (Stage 1, Stage 2, ...),
 * carrying its own amount, due date and release status.
 *
 * Status lifecycle: PENDING -> COMPLETED -> RELEASED
 * (OVERDUE can happen while PENDING, past due_date; REJECTED is a
 * terminal dead-end set by finance).
 */
@Entity
@Table(
        name = "application_milestones",
        indexes = {
                @Index(name = "idx_app_milestone_application_id", columnList = "application_id"),
                @Index(name = "idx_app_milestone_status", columnList = "status"),
                @Index(name = "idx_app_milestone_due_date", columnList = "due_date")
        }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ApplicationMilestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_milestone_id")
    private Integer applicationMilestoneId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SchemeMilestone milestone;

    /**
     * PENDING | COMPLETED | RELEASED | OVERDUE | REJECTED
     */
    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "completed_date")
    private LocalDate completedDate;

    /**
     * Snapshot of the stage amount at the time the plan was configured
     * (copied from SchemeMilestone.amount). Kept on the row itself -
     * exactly like the guide's "amount_to_release" column - so that a
     * later edit to the scheme's milestone template never changes what
     * an already-configured beneficiary stage is worth.
     */
    @Column(name = "amount_to_release", precision = 15, scale = 2)
    private BigDecimal amountToRelease;

    /**
     * Actually released amount, filled in only once the stage reaches
     * RELEASED. Normally equal to amountToRelease.
     */
    @Column(name = "amount_released", precision = 15, scale = 2)
    private BigDecimal amountReleased;

    @Column(name = "release_date")
    private LocalDateTime releaseDate;

    /**
     * Set only when an ADMIN clears an OVERDUE stage via the
     * PUT /disbursement/milestone/{id}/resolve endpoint.
     */
    @Column(name = "resolved_reason", columnDefinition = "TEXT")
    private String resolvedReason;

    @Column(name = "resolved_by", length = 100)
    private String resolvedBy;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    public void prePersist() {
        if (status == null) status = "PENDING";
        if (amountToRelease == null && milestone != null) {
            amountToRelease = milestone.getAmount();
        }
    }
}
