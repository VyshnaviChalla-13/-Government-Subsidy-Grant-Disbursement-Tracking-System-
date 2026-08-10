package com.example.Government.subsidy.Project.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "application_milestones")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ApplicationMilestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_milestone_id")
    private Integer applicationMilestoneId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id", nullable = false)
    private SchemeMilestone milestone;

    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "completed_date")
    private LocalDate completedDate;

    @PrePersist
    public void prePersist() {
        if (status == null) status = "PENDING";
    }
}
