package com.example.Government.subsidy.Project.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_milestone_id", nullable = false)
    private ApplicationMilestone applicationMilestone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "finance_officer_id", nullable = false)
    private Officer financeOfficer;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_status", nullable = false, length = 30)
    private String paymentStatus = "PENDING";

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @PrePersist
    public void prePersist() {
        if (paymentStatus == null) paymentStatus = "PENDING";
    }
}
