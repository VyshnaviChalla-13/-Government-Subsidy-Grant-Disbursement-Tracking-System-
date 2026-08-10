package com.example.Government.subsidy.Project.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "scheme_categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SchemeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scheme_category_id")
    private Integer schemeCategoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(nullable = false, length = 50)
    private String category;
}
