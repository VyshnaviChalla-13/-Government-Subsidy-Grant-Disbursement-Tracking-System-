package com.example.Government.subsidy.Project.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "scheme_required_documents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SchemeRequiredDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(name = "document_name", nullable = false, length = 150)
    private String documentName;

    @Column(nullable = false)
    private Boolean mandatory = true;
}
