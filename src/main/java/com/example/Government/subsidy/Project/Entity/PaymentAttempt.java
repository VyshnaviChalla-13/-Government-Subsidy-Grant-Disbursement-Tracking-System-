package com.example.Government.subsidy.Project.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_attempts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PaymentAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attempt_id")
    private Integer attemptId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private PaymentTransaction payment;

    @Column(name = "attempt_number", nullable = false)
    private Integer attemptNumber;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "attempted_at", updatable = false)
    private LocalDateTime attemptedAt;

    @PrePersist
    public void prePersist() {
        attemptedAt = LocalDateTime.now();
    }
}
