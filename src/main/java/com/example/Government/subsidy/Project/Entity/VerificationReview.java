package com.example.Government.subsidy.Project.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class VerificationReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Integer reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private VerificationAssignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "officer_id", nullable = false)
    private Officer officer;

    @Column(nullable = false, length = 30)
    private String stage; // FIELD or VERIFICATION

    @Column(nullable = false, length = 30)
    private String action; // APPROVE, RETURN, REJECT

    @Column(name = "rejection_reason_id")
    private Integer rejectionReasonId;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "reviewed_at", updatable = false)
    private LocalDateTime reviewedAt;

    @PrePersist
    public void prePersist() {
        reviewedAt = LocalDateTime.now();
    }
}
