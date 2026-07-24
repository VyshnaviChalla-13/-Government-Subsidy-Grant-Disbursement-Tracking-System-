package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.Application;
import com.example.Government.subsidy.Project.Entity.Scheme;
import com.example.Government.subsidy.Project.Entity.User;
import com.example.Government.subsidy.Project.Repository.ApplicationRepository;
import com.example.Government.subsidy.Project.Repository.SchemeRepository;
import com.example.Government.subsidy.Project.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private UserRepository userRepository;

    private String currentPrincipalMobile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    private boolean currentUserIsOfficer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("OFFICER"));
    }

    public Application getApplicationByIdForCurrentUser(Integer id) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return null;
        if (currentUserIsOfficer()) return application;

        String callerMobile = currentPrincipalMobile();
        String ownerMobile = application.getBeneficiary().getMobileNumber();
        return (ownerMobile != null && ownerMobile.equals(callerMobile)) ? application : null;
    }

    public String resubmitApplicationForCurrentUser(Integer id, String customFields) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";

        String callerMobile = currentPrincipalMobile();
        String ownerMobile = application.getBeneficiary().getMobileNumber();
        if (ownerMobile == null || !ownerMobile.equals(callerMobile)) {
            return "You are not authorized to resubmit this application";
        }
        if (!"RETURNED".equalsIgnoreCase(application.getStatus())) {
            return "Only returned applications can be resubmitted";
        }
        application.setCustomFields(customFields);
        application.setStatus("RESUBMITTED");
        applicationRepository.save(application);
        return "Application resubmitted successfully";
    }

    public String submitApplication(Integer beneficiaryId, Integer schemeId, String customFields) {

        User beneficiary = userRepository.findById(beneficiaryId).orElse(null);
        if (beneficiary == null) {
            return "Beneficiary not found";
        }

        Scheme scheme = schemeRepository.findById(schemeId).orElse(null);
        if (scheme == null) {
            return "Scheme not found";
        }

        if (!"ACTIVE".equals(scheme.getStatus())) {
            return "Scheme is not active";
        }

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
        if (!byName.isEmpty()) {
            return byName;
        }
        return applicationRepository.findByBeneficiary_AadhaarNumberContaining(keyword);
    }

    public String resubmitApplication(Integer id, String customFields) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) {
            return "Application not found";
        }
        if (!"RETURNED".equalsIgnoreCase(application.getStatus())) {
            return "Only returned applications can be resubmitted";
        }
        application.setCustomFields(customFields);
        application.setStatus("RESUBMITTED");
        applicationRepository.save(application);
        return "Application resubmitted successfully";
    }

    public String updateStatus(Integer id, String newStatus, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) {
            return "Application not found";
        }
        application.setStatus(newStatus);
        application.setRemarks(remarks);
        applicationRepository.save(application);
        return "Application status updated to " + newStatus;
    }
}
