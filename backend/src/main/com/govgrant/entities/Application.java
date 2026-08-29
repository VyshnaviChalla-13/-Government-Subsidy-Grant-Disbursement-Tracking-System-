package com.govgrant.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="applications")
@Data
@NoArgsContructor
@AllArgsConstructor

public class Application{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="application_id")
    private long applicationId;

    @Column(name = "application_number", nullable = false, unique = true, length = 30)
    private String applicationNumber;

    @ManyToOne(fetch= FetchType.EAGER)
    @JoinColumn(name="beneficiary_id", nullable=false)
    private Beneficiary beneficiary;

    @ManyToOne(fetch=FetchType.EAGER)
    @joinColumn(name="scheme_id", nullable=false)
    private Scheme scheme;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="current_status_id", nullable=false)
    private ApplicationStatus currentStatus;

    @Column(name='eligibility_socre', precision=5, scale=2)
    private BigDecimal eligibilityScore;

    @Column(name = "scoring_breakdown", columnDefinition = "TEXT")
    private String scoringBreakdown; // JSON breakdown of criteria scores

    @CreationTimestamp
    @Column(name = "submitted_at", nullable=false, updatable=false)
    private LocalDateTime submittedAt;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

}