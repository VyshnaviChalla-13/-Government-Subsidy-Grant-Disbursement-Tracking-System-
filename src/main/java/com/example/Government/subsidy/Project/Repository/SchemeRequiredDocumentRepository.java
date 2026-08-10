package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.Scheme;
import com.example.Government.subsidy.Project.Entity.SchemeRequiredDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SchemeRequiredDocumentRepository extends JpaRepository<SchemeRequiredDocument, Integer> {
    List<SchemeRequiredDocument> findByScheme(Scheme scheme);
}
