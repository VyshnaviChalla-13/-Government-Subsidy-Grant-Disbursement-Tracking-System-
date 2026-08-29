package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Entity.Application;
import com.example.Government.subsidy.Project.Service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/submit")
    public String submitApplication(@RequestParam Integer beneficiaryId,
                                    @RequestParam Integer schemeId,
                                    @RequestBody(required = false) Map<String, Object> customFields) {
        String json = customFields != null ? customFields.toString() : null;
        return applicationService.submitApplication(beneficiaryId, schemeId, json);
    }

    @GetMapping("/all")
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    // Role-aware list: admins/officers see everything, a beneficiary sees only their own applications.
    @GetMapping("/mine")
    public List<Application> getVisibleApplications() {
        return applicationService.getVisibleApplications();
    }

    @GetMapping("/{id}")
    public Application getApplication(@PathVariable Integer id) {
        return applicationService.getApplicationById(id);
    }

    @GetMapping("/search")
    public List<Application> searchApplications(@RequestParam String keyword) {
        return applicationService.searchApplications(keyword);
    }

    @PutMapping("/{id}/resubmit")
    public String resubmitApplication(@PathVariable Integer id, @RequestBody Map<String, Object> customFields) {
        return applicationService.resubmitApplication(id, customFields.toString());
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN')")
    public String assignOfficer(@PathVariable Integer id, @RequestParam Integer officerId) {
        return applicationService.assignOfficer(id, officerId);
    }

    // ---------- Field Officer (front desk) stage ----------

    @PatchMapping("/{id}/field-approve")
    @PreAuthorize("hasRole('FRONT_DESK_OFFICER')")
    public String fieldApprove(@PathVariable Integer id, @RequestParam(required = false) String remarks) {
        return applicationService.fieldApprove(id, remarks);
    }

    @PatchMapping("/{id}/field-return")
    @PreAuthorize("hasRole('FRONT_DESK_OFFICER')")
    public String fieldReturn(@PathVariable Integer id, @RequestParam String remarks) {
        return applicationService.fieldReturn(id, remarks);
    }

    @PatchMapping("/{id}/field-reject")
    @PreAuthorize("hasRole('FRONT_DESK_OFFICER')")
    public String fieldReject(@PathVariable Integer id, @RequestParam String remarks) {
        return applicationService.fieldReject(id, remarks);
    }

    // ---------- Verification Officer stage ----------

    @PatchMapping("/{id}/verify-approve")
    @PreAuthorize("hasRole('VERIFICATION_OFFICER')")
    public String verifyApprove(@PathVariable Integer id, @RequestParam(required = false) String remarks) {
        return applicationService.verifyApprove(id, remarks);
    }

    @PatchMapping("/{id}/verify-return")
    @PreAuthorize("hasRole('VERIFICATION_OFFICER')")
    public String verifyReturn(@PathVariable Integer id, @RequestParam String remarks) {
        return applicationService.verifyReturn(id, remarks);
    }

    @PatchMapping("/{id}/verify-reject")
    @PreAuthorize("hasRole('VERIFICATION_OFFICER')")
    public String verifyReject(@PathVariable Integer id, @RequestParam String remarks) {
        return applicationService.verifyReject(id, remarks);
    }
}
