package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Entity.Application;
import com.example.Government.subsidy.Project.Service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
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
        String customFieldsJson = customFields != null ? customFields.toString() : null;
        return applicationService.submitApplication(beneficiaryId, schemeId, customFieldsJson);
    }

    @GetMapping("/all")
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
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
    public String resubmitApplication(@PathVariable Integer id,
                                       @RequestBody Map<String, Object> customFields) {
        return applicationService.resubmitApplication(id, customFields.toString());
    }

    @PatchMapping("/{id}/status")
    public String updateStatus(@PathVariable Integer id,
                                @RequestParam String status,
                                @RequestParam(required = false) String remarks) {
        return applicationService.updateStatus(id, status, remarks);
    }
}
