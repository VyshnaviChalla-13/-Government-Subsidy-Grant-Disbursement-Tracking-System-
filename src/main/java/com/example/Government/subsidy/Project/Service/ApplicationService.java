package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.Application;
import com.example.Government.subsidy.Project.Entity.Officer;
import com.example.Government.subsidy.Project.Entity.Scheme;
import com.example.Government.subsidy.Project.Entity.User;
import com.example.Government.subsidy.Project.Repository.ApplicationRepository;
import com.example.Government.subsidy.Project.Repository.OfficerRepository;
import com.example.Government.subsidy.Project.Repository.SchemeRepository;
import com.example.Government.subsidy.Project.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OfficerRepository officerRepository;

    private String currentPrincipalMobile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    private boolean isAssignedToCurrentOfficer(Application application) {
        if (application.getAssignedOfficer() == null) return false;
        String officerMobile = application.getAssignedOfficer().getUser().getMobileNumber();
        String callerMobile = currentPrincipalMobile();
        return officerMobile != null && officerMobile.equals(callerMobile);
    }

    public String submitApplication(Integer beneficiaryId, Integer schemeId, String customFields) {
        User beneficiary = userRepository.findById(beneficiaryId).orElse(null);
        if (beneficiary == null) return "Beneficiary not found";

        Scheme scheme = schemeRepository.findById(schemeId).orElse(null);
        if (scheme == null) return "Scheme not found";
        if (!"ACTIVE".equals(scheme.getStatus())) return "Scheme is not active";

        Application application = new Application();
        application.setBeneficiary(beneficiary);
        application.setScheme(scheme);
        application.setCustomFields(customFields);
        applicationRepository.save(application);

        return "Application submitted successfully with number " + application.getApplicationNumber();
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application getApplicationById(Integer id) {
        return applicationRepository.findById(id).orElse(null);
    }

    public List<Application> searchApplications(String keyword) {
        List<Application> byName = applicationRepository.findByBeneficiary_FullNameContainingIgnoreCase(keyword);
        if (!byName.isEmpty()) return byName;
        return applicationRepository.findByBeneficiary_AadhaarNumberContaining(keyword);
    }

    public String resubmitApplication(Integer id, String customFields) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!"RETURNED".equalsIgnoreCase(application.getStatus()))
            return "Only returned applications can be resubmitted";
        application.setCustomFields(customFields);
        application.setStatus("RESUBMITTED");
        applicationRepository.save(application);
        return "Application resubmitted successfully";
    }

    public String assignOfficer(Integer applicationId, Integer officerId) {
        Application application = applicationRepository.findById(applicationId).orElse(null);
        if (application == null) return "Application not found";
        Officer officer = officerRepository.findById(officerId).orElse(null);
        if (officer == null) return "Officer not found";
        application.setAssignedOfficer(officer);
        applicationRepository.save(application);
        return "Application assigned to officer successfully";
    }

    public String fieldApprove(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!isAssignedToCurrentOfficer(application)) return "You are not assigned to this application";
        if (!"SUBMITTED".equalsIgnoreCase(application.getStatus())
                && !"RESUBMITTED".equalsIgnoreCase(application.getStatus()))
            return "Application is not awaiting field review";
        application.setStatus("FIELD_APPROVED");
        application.setRemarks(remarks);
        applicationRepository.save(application);
        return "Application approved at field level";
    }

    public String fieldReturn(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!isAssignedToCurrentOfficer(application)) return "You are not assigned to this application";
        if (remarks == null || remarks.isBlank()) return "Remarks are mandatory when returning an application";
        application.setStatus("RETURNED");
        application.setRemarks(remarks);
        applicationRepository.save(application);
        return "Application returned to beneficiary for correction";
    }

    public String fieldReject(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!isAssignedToCurrentOfficer(application)) return "You are not assigned to this application";
        if (remarks == null || remarks.isBlank()) return "Remarks are mandatory when rejecting an application";
        application.setStatus("REJECTED");
        application.setRemarks(remarks);
        applicationRepository.save(application);
        return "Application rejected";
    }

    public String verifyApprove(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!isAssignedToCurrentOfficer(application)) return "You are not assigned to this application";
        if (!"FIELD_APPROVED".equalsIgnoreCase(application.getStatus()))
            return "Application has not passed field review yet";
        application.setStatus("VERIFICATION_APPROVED");
        application.setRemarks(remarks);
        applicationRepository.save(application);
        return "Application approved by verification officer";
    }

    public String verifyReturn(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!isAssignedToCurrentOfficer(application)) return "You are not assigned to this application";
        if (remarks == null || remarks.isBlank()) return "Remarks are mandatory when returning an application";
        application.setStatus("RETURNED");
        application.setRemarks(remarks);
        applicationRepository.save(application);
        return "Application returned by verification officer";
    }

    public String verifyReject(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!isAssignedToCurrentOfficer(application)) return "You are not assigned to this application";
        if (remarks == null || remarks.isBlank()) return "Remarks are mandatory when rejecting an application";
        application.setStatus("REJECTED");
        application.setRemarks(remarks);
        applicationRepository.save(application);
        return "Application rejected by verification officer";
    }
}
