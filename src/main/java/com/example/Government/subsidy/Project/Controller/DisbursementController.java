package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Entity.ApplicationMilestone;
import com.example.Government.subsidy.Project.Service.DisbursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/disbursement")
@CrossOrigin(origins = "*")
public class DisbursementController {

    @Autowired private DisbursementService disbursementService;

    @PostMapping("/schemes/{schemeId}/milestones")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN')")
    public String addMilestone(@PathVariable Integer schemeId,
                                @RequestParam String name,
                                @RequestParam(required = false) String description,
                                @RequestParam Integer order,
                                @RequestParam BigDecimal amount,
                                @RequestParam(required = false) Integer dueAfterDays) {
        return disbursementService.addSchemeMilestone(schemeId, name, description, order, amount, dueAfterDays);
    }

    @PostMapping("/applications/{applicationId}/init")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN')")
    public String initMilestones(@PathVariable Integer applicationId) {
        return disbursementService.initializeApplicationMilestones(applicationId);
    }

    @GetMapping("/applications/{applicationId}")
    public List<ApplicationMilestone> getMilestones(@PathVariable Integer applicationId) {
        return disbursementService.getMilestonesForApplication(applicationId);
    }

    @PatchMapping("/milestones/{id}/submit")
    public String submitMilestone(@PathVariable Integer id) {
        return disbursementService.submitMilestone(id);
    }

    @GetMapping("/queue")
    @PreAuthorize("hasRole('FINANCE_OFFICER')")
    public List<ApplicationMilestone> getFinanceQueue() {
        return disbursementService.getPendingFinanceQueue();
    }

    @PatchMapping("/milestones/{id}/approve")
    @PreAuthorize("hasRole('FINANCE_OFFICER')")
    public String approve(@PathVariable Integer id, @RequestParam(required = false) String transactionReference) {
        return disbursementService.approveAndDisburse(id, transactionReference);
    }

    @PatchMapping("/milestones/{id}/reject")
    @PreAuthorize("hasRole('FINANCE_OFFICER')")
    public String reject(@PathVariable Integer id, @RequestParam String reason) {
        return disbursementService.rejectMilestone(id, reason);
    }
}
