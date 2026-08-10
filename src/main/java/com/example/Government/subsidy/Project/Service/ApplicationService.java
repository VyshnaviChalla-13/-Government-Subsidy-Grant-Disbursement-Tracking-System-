package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.Application;
import com.example.Government.subsidy.Project.Entity.Scheme;
import com.example.Government.subsidy.Project.Entity.User;
import com.example.Government.subsidy.Project.Repository.ApplicationRepository;
import com.example.Government.subsidy.Project.Repository.SchemeRepository;
import com.example.Government.subsidy.Project.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
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
    private EligibilityScoreService eligibilityScoreService;

    private String currentPrincipalMobile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    private boolean currentUserHasAnyRole(String... roles) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        for (String role : roles) {
            String target = "ROLE_" + role;
            boolean match = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(a -> a.equals(target));
            if (match) return true;
        }
        return false;
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

        eligibilityScoreService.evaluateApplication(application);
        applicationRepository.save(application);

        return "Application submitted. Eligibility: " + application.getEligibilityStatus()
                + " (score: " + application.getEligibilityScore() + ")";
    }

    public List<Application> getVisibleApplications() {
        if (currentUserHasAnyRole("SUPER_ADMIN", "DEPT_ADMIN", "FIELD_OFFICER", "DISTRICT_OFFICER", "FINANCE_OFFICER")) {
            return applicationRepository.findAll();
        }
        String mobile = currentPrincipalMobile();
        return applicationRepository.findByBeneficiary_MobileNumber(mobile);
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
}
