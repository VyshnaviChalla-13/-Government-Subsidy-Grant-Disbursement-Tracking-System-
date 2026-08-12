package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.DTO.ResolveOverdueRequest;
import com.example.Government.subsidy.Project.DTO.StageConfigRequest;
import com.example.Government.subsidy.Project.Entity.ApplicationMilestone;
import com.example.Government.subsidy.Project.Entity.SchemeMilestone;
import com.example.Government.subsidy.Project.Service.DisbursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/disbursement")
@CrossOrigin(origins = "*")
public class DisbursementController {

    @Autowired
    private DisbursementService disbursementService;

    // ---------- Task 1: plan configuration & milestone scheduling ----------

    /**
     * POST /disbursement/plan/{schemeId}/configure
     * Body: [ { "milestoneOrder": 1, "milestoneName": "...", "amount": 20000, "dueAfterDays": 7 }, ... ]
     * Rejects with HTTP 400 if the amounts don't sum to the scheme's approved grant.
     */
    @PostMapping("/plan/{schemeId}/configure")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<SchemeMilestone>> configurePlan(@PathVariable Integer schemeId,
                                                               @RequestBody List<StageConfigRequest> stages) {
        return ResponseEntity.ok(disbursementService.configurePlan(schemeId, stages));
    }

    // Single-stage add, kept for convenience (no running-total validation).
    @PostMapping("/schemes/{schemeId}/milestones")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<String> addMilestone(@PathVariable Integer schemeId,
                                               @RequestParam String name,
                                               @RequestParam(required = false) String description,
                                               @RequestParam Integer order,
                                               @RequestParam BigDecimal amount,
                                               @RequestParam(required = false) Integer dueAfterDays) {
        return ResponseEntity.ok(disbursementService.addSchemeMilestone(schemeId, name, description, order, amount, dueAfterDays));
    }

    @PostMapping("/applications/{applicationId}/init")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<String> initMilestones(@PathVariable Integer applicationId) {
        return ResponseEntity.ok(disbursementService.initializeApplicationMilestones(applicationId));
    }

    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<List<ApplicationMilestone>> getMilestones(@PathVariable Integer applicationId) {
        return ResponseEntity.ok(disbursementService.getMilestonesForApplication(applicationId));
    }

    // PATCH /disbursement/milestone/{id}/complete - beneficiary/officer marks the stage requirement done
    @PatchMapping("/milestone/{id}/complete")
    public ResponseEntity<String> completeMilestone(@PathVariable Integer id) {
        return ResponseEntity.ok(disbursementService.completeMilestone(id));
    }

    @GetMapping("/queue")
    @PreAuthorize("hasRole('FINANCE_OFFICER')")
    public ResponseEntity<List<ApplicationMilestone>> getFinanceQueue() {
        return ResponseEntity.ok(disbursementService.getPendingFinanceQueue());
    }

    // POST /disbursement/release/{applicationMilestoneId} - the staged-release endpoint from the guide
    @PostMapping("/release/{applicationMilestoneId}")
    @PreAuthorize("hasRole('FINANCE_OFFICER')")
    public ResponseEntity<String> release(@PathVariable Integer applicationMilestoneId,
                                          @RequestParam(required = false) String transactionReference) {
        return ResponseEntity.ok(disbursementService.releaseStage(applicationMilestoneId, transactionReference));
    }

    @PatchMapping("/milestones/{id}/reject")
    @PreAuthorize("hasRole('FINANCE_OFFICER')")
    public ResponseEntity<String> reject(@PathVariable Integer id, @RequestParam String reason) {
        return ResponseEntity.ok(disbursementService.rejectMilestone(id, reason));
    }

    // ---------- Task 2: compliance & admin override ----------

    // PUT /disbursement/milestone/{id}/resolve - admin override for an OVERDUE stage, reason mandatory
    @PutMapping("/milestone/{id}/resolve")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<String> resolveOverdue(@PathVariable Integer id, @RequestBody ResolveOverdueRequest request) {
        String reason = request != null ? request.getReason() : null;
        return ResponseEntity.ok(disbursementService.resolveOverdue(id, reason));
    }
}
