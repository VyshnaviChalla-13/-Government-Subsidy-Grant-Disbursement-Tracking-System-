package com.example.Government.subsidy.Project.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "scheme_milestones")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SchemeMilestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "milestone_id")
    private Integer milestoneId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(name = "milestone_name", nullable = false, length = 150)
    private String milestoneName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "milestone_order", nullable = false)
    private Integer milestoneOrder;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "due_after_days")
    private Integer dueAfterDays;
}
