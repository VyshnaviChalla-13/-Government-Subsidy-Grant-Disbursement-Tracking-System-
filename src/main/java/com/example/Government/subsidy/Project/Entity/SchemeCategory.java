package com.example.Government.subsidy.Project.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "scheme_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchemeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scheme_category_id")
    private Integer schemeCategoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler","user","department"})
    private Scheme scheme;

    @Column(name = "category", nullable = false, length = 100)
    private String category;
}