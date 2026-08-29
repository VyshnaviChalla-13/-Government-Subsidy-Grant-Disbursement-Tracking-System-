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
    public org.springframework.http.ResponseEntity<?> submitApplication(
            @RequestParam(required = false) Integer beneficiaryId,
            @RequestParam(required = false) Integer schemeId,
            @RequestBody(required = false) Map<String, Object> customFields) {
        String json = customFields != null ? customFields.toString() : null;
        String result = applicationService.submitApplication(beneficiaryId, schemeId, json);
        if (result != null && result.startsWith("Error")) {
            return org.springframework.http.ResponseEntity.badRequest().body(Map.of("message", result));
        }
        return org.springframework.http.ResponseEntity.ok(Map.of("message", result != null ? result : "Application submitted successfully"));
    }

    @GetMapping
    public List<Application> getApplications() {
        return applicationService.getVisibleApplications();
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
    public String assignOfficer(@PathVariable Integer id, @RequestParam Integer officerId) {
        return applicationService.assignOfficer(id, officerId);
    }

    // ---------- Field Officer (front desk) stage ----------

    @PatchMapping("/{id}/field-approve")
    public String fieldApprove(@PathVariable Integer id, @RequestParam(required = false) String remarks) {
        return applicationService.fieldApprove(id, remarks);
    }

    @PatchMapping("/{id}/field-return")
    public String fieldReturn(@PathVariable Integer id, @RequestParam String remarks) {
        return applicationService.fieldReturn(id, remarks);
    }

    @PatchMapping("/{id}/field-reject")
    public String fieldReject(@PathVariable Integer id, @RequestParam String remarks) {
        return applicationService.fieldReject(id, remarks);
    }

    // ---------- Verification Officer stage ----------

    @PatchMapping("/{id}/verify-approve")
    public String verifyApprove(@PathVariable Integer id, @RequestParam(required = false) String remarks) {
        return applicationService.verifyApprove(id, remarks);
    }

    @PatchMapping("/{id}/verify-return")
    public String verifyReturn(@PathVariable Integer id, @RequestParam String remarks) {
        return applicationService.verifyReturn(id, remarks);
    }

    @PatchMapping("/{id}/verify-reject")
    public String verifyReject(@PathVariable Integer id, @RequestParam String remarks) {
        return applicationService.verifyReject(id, remarks);
    }
}
