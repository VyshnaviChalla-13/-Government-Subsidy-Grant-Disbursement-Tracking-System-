package com.example.Government.subsidy.Project.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "schemes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scheme_id")
    private Integer schemeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private User user;

    @Column(name = "scheme_name", nullable = false, length = 200)
    private String schemeName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "total_budget", nullable = false)
    private BigDecimal totalBudget;

    @Column(name = "budget_used", nullable = false)
    private BigDecimal budgetUsed = BigDecimal.ZERO;

    @Column(name = "min_grant", nullable = false)
    private BigDecimal minGrant;

    @Column(name = "max_grant", nullable = false)
    private BigDecimal maxGrant;

    @Column(name = "maximum_income")
    private Double maximumIncome;

    @Column(name = "minimum_score")
    private Integer minimumScore = 50;

    @Column(name = "application_start_date", nullable = false)
    private LocalDate applicationStartDate;

    @Column(name = "application_end_date", nullable = false)
    private LocalDate applicationEndDate;

    @Column(name = "eligibility_score", nullable = false)
    private BigDecimal eligibilityScore;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();

        if (budgetUsed == null) {
            budgetUsed = BigDecimal.ZERO;
        }

        if (status == null) {
            status = "ACTIVE";
        }

        if (minimumScore == null) {
            minimumScore = 50;
        }
    }
}
