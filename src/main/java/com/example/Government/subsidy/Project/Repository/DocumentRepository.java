package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.Application;
import com.example.Government.subsidy.Project.Entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {

    // Get all documents uploaded for an application
    List<Document> findByApplication(Application application);

    // Get only verified documents
    List<Document> findByApplicationAndVerifiedTrue(Application application);

    // Count verified documents
    long countByApplicationAndVerifiedTrue(Application application);

    // Count total uploaded documents
    long countByApplication(Application application);
}