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
import com.example.Government.subsidy.Project.Entity.Officer;
import com.example.Government.subsidy.Project.Repository.OfficerRepository;

import java.util.List;

@Service
public class ApplicationService {

    // Status constants - kept centralized so the field/verification stage
    // transitions below all agree on the same literal strings.
    private static final String STATUS_SUBMITTED = "SUBMITTED";
    private static final String STATUS_RESUBMITTED = "RESUBMITTED";
    private static final String STATUS_PENDING_VERIFICATION = "PENDING_VERIFICATION";
    private static final String STATUS_VERIFICATION_APPROVED = "VERIFICATION_APPROVED";
    private static final String STATUS_RETURNED = "RETURNED";
    private static final String STATUS_REJECTED = "REJECTED";

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EligibilityScoreService eligibilityScoreService;

    @Autowired
    private OfficerRepository officerRepository;

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

    public String assignOfficer(Integer applicationId, Integer officerId) {
        Application application = applicationRepository.findById(applicationId).orElse(null);
        if (application == null) {
            return "Application not found";
        }

        Officer officer = officerRepository.findById(officerId).orElse(null);
        if (officer == null) {
            return "Officer not found";
        }

        application.setAssignedOfficer(officer);
        applicationRepository.save(application);

        return "Officer assigned successfully";
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

    @Autowired
    @org.springframework.context.annotation.Lazy
    private DisbursementService disbursementService;

    public List<Application> getVisibleApplications() {
        if (currentUserHasAnyRole("SUPER_ADMIN", "DEPT_ADMIN")) {
            return applicationRepository.findAll();
        }
        if (currentUserHasAnyRole("FRONT_DESK_OFFICER")) {
            return applicationRepository.findByStatusIn(List.of(
                    STATUS_SUBMITTED, STATUS_RESUBMITTED, "PENDING_FIELD_REVIEW", "PENDING_FRONT_DESK",
                    STATUS_RETURNED, STATUS_REJECTED
            ));
        }
        if (currentUserHasAnyRole("VERIFICATION_OFFICER")) {
            return applicationRepository.findByStatusIn(List.of(
                    STATUS_PENDING_VERIFICATION, "FIELD_APPROVED", "UNDER_VERIFICATION"
            ));
        }
        if (currentUserHasAnyRole("FINANCE_OFFICER")) {
            return applicationRepository.findByStatusIn(List.of(
                    STATUS_VERIFICATION_APPROVED, "PENDING_FINANCE", "APPROVED", "STAGE_RELEASED", "DISBURSED"
            ));
        }
        String mobile = currentPrincipalMobile();
        return applicationRepository.findByBeneficiary_MobileNumber(mobile);
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
        if (!STATUS_RETURNED.equalsIgnoreCase(application.getStatus()))
            return "Only returned applications can be resubmitted";
        application.setCustomFields(customFields);
        application.setStatus(STATUS_RESUBMITTED);
        applicationRepository.save(application);
        return "Application resubmitted successfully";
    }

    // ---------------------------------------------------------------
    // Field Officer (front desk) stage: SUBMITTED/RESUBMITTED -> ...
    // ---------------------------------------------------------------

    public String fieldApprove(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!isAtFieldStage(application)) {
            return "Application is not awaiting field review (current status: " + application.getStatus() + ")";
        }

        application.setStatus(STATUS_PENDING_VERIFICATION);
        application.setRemarks(remarks);
        applicationRepository.save(application);

        return "Application approved by Field Officer and forwarded to District Officer for verification";
    }

    public String fieldReturn(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!isAtFieldStage(application)) {
            return "Application is not awaiting field review (current status: " + application.getStatus() + ")";
        }
        if (remarks == null || remarks.isBlank()) {
            return "Remarks are mandatory when returning an application";
        }

        application.setStatus(STATUS_RETURNED);
        application.setRemarks(remarks);
        applicationRepository.save(application);

        return "Application returned to beneficiary for corrections";
    }

    public String fieldReject(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!isAtFieldStage(application)) {
            return "Application is not awaiting field review (current status: " + application.getStatus() + ")";
        }
        if (remarks == null || remarks.isBlank()) {
            return "A rejection reason is mandatory";
        }

        application.setStatus(STATUS_REJECTED);
        application.setRejectionReason(remarks);
        applicationRepository.save(application);

        return "Application rejected by Field Officer";
    }

    // ---------------------------------------------------------------
    // Verification Officer stage: PENDING_VERIFICATION -> ...
    // ---------------------------------------------------------------

    public String verifyApprove(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!STATUS_PENDING_VERIFICATION.equalsIgnoreCase(application.getStatus()) && !"FIELD_APPROVED".equalsIgnoreCase(application.getStatus())) {
            return "Application is not awaiting verification (current status: " + application.getStatus() + ")";
        }

        application.setStatus(STATUS_VERIFICATION_APPROVED);
        application.setRemarks(remarks);
        applicationRepository.save(application);

        try {
            if (disbursementService != null) {
                disbursementService.initializeApplicationMilestones(application.getApplicationId());
            }
        } catch (Exception e) {
            // Milestone plan might not be configured yet or already initialized
        }

        return "Application approved by District Officer and forwarded to Finance Officer for disbursement";
    }

    public String verifyReturn(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!STATUS_PENDING_VERIFICATION.equalsIgnoreCase(application.getStatus())) {
            return "Application is not awaiting verification (current status: " + application.getStatus() + ")";
        }
        if (remarks == null || remarks.isBlank()) {
            return "Remarks are mandatory when returning an application";
        }

        application.setStatus(STATUS_RETURNED);
        application.setRemarks(remarks);
        applicationRepository.save(application);

        return "Application returned to beneficiary for corrections";
    }

    public String verifyReject(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (!STATUS_PENDING_VERIFICATION.equalsIgnoreCase(application.getStatus())) {
            return "Application is not awaiting verification (current status: " + application.getStatus() + ")";
        }
        if (remarks == null || remarks.isBlank()) {
            return "A rejection reason is mandatory";
        }

        application.setStatus(STATUS_REJECTED);
        application.setRejectionReason(remarks);
        applicationRepository.save(application);

        return "Application rejected by Verification Officer";
    }

    private boolean isAtFieldStage(Application application) {
        return STATUS_SUBMITTED.equalsIgnoreCase(application.getStatus())
                || STATUS_RESUBMITTED.equalsIgnoreCase(application.getStatus());
    }
}
