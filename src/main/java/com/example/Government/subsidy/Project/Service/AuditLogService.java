package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.AuditLog;
import com.example.Government.subsidy.Project.Repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(
            Integer entityId,
            String performedBy,
            String action,
            String entityType,
            String details
    ) {
        AuditLog auditLog = AuditLog.builder()
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .performedBy(performedBy)
                .details(details)
                .build();

        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    public List<AuditLog> getLogsForEntity(String entityType, Integer entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByPerformedAtAsc(entityType, entityId);
    }
}