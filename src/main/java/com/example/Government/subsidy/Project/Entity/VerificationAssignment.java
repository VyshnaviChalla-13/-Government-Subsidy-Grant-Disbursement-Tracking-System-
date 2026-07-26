package com.example.Government.subsidy.Project.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_assignments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class VerificationAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Integer assignmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_officer_id")
    private Officer fieldOfficer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_officer_id")
    private Officer districtOfficer;

    @Column(name = "assigned_at", updatable = false)
    private LocalDateTime assignedAt;

    @Column(nullable = false, length = 30)
    private String status = "ASSIGNED";

    @PrePersist
    public void prePersist() {
        assignedAt = LocalDateTime.now();
        if (status == null) status = "ASSIGNED";
    }
}
