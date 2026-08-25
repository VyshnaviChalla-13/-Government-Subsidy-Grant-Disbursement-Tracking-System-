package com.example.Government.subsidy.Project.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "audit_log",
        indexes = {
                @Index(
                        name = "idx_audit_entity",
                        columnList = "entity_type, entity_id"
                ),
                @Index(
                        name = "idx_audit_performed_at",
                        columnList = "performed_at"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_id")
    private Long auditId;

    @Column(nullable = false, length = 60)
    private String action;

    @Column(
            name = "entity_type",
            nullable = false,
            length = 60
    )
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Integer entityId;

    @Column(name = "performed_by", length = 100)
    private String performedBy;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "performed_at", updatable = false)
    private LocalDateTime performedAt;

    @PrePersist
    public void prePersist() {
        performedAt = LocalDateTime.now();
    }
}