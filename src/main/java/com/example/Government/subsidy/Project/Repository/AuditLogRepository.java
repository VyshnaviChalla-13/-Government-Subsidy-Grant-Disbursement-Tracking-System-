package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByEntityTypeAndEntityIdOrderByPerformedAtAsc(String entityType, Integer entityId);
}
