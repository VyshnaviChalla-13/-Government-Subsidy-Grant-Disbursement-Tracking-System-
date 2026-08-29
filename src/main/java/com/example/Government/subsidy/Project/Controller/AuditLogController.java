package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Entity.AuditLog;
import com.example.Government.subsidy.Project.Service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','DEPT_ADMIN')")
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    @GetMapping("/entity")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','DEPT_ADMIN')")
    public ResponseEntity<List<AuditLog>> getLogsForEntity(@RequestParam String entityType,
                                                          @RequestParam Integer entityId) {
        return ResponseEntity.ok(auditLogService.getLogsForEntity(entityType, entityId));
    }
}
