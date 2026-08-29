package com.example.Government.subsidy.Project.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "scheme_required_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchemeRequiredDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user", "department"})
    private Scheme scheme;

    @Column(name = "document_name", nullable = false, length = 150)
    private String documentName;

    @Column(nullable = false)
    private Boolean mandatory = true;

    @Column(nullable = false)
    private Integer points = 10;
}