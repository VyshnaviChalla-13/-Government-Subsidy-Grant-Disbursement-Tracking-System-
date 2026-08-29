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

    @Autowired
    private NotificationService notificationService;

    private String currentPrincipalMobile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    private boolean currentUserHasAnyRole(String... roles) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        for (String role : roles) {
            String target = "ROLE_" + role.toUpperCase();
            String cleanRole = role.toUpperCase();
            boolean match = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(a -> a.equalsIgnoreCase(target) || a.equalsIgnoreCase(cleanRole));
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
        User beneficiary = null;
        if (beneficiaryId != null) {
            beneficiary = userRepository.findById(beneficiaryId).orElse(null);
        }
        if (beneficiary == null) {
            String mobile = currentPrincipalMobile();
            if (mobile != null) {
                beneficiary = userRepository.findBymobileNumber(mobile).orElse(null);
            }
        }
        if (beneficiary == null) return "Error: Beneficiary user record not found";

        Scheme scheme = null;
        if (schemeId != null) {
            scheme = schemeRepository.findById(schemeId).orElse(null);
        }
        if (scheme == null) {
            List<Scheme> allSchemes = schemeRepository.findAll();
            if (!allSchemes.isEmpty()) {
                scheme = allSchemes.get(0);
            }
        }
        if (scheme == null) return "Error: Scheme not found";

        Application application = new Application();
        application.setBeneficiary(beneficiary);
        application.setScheme(scheme);
        application.setCustomFields(customFields);
        application.setStatus(STATUS_SUBMITTED);
        application.setApplicationNumber("APP-" + System.currentTimeMillis());

        try {
            eligibilityScoreService.evaluateApplication(application);
        } catch (Exception e) {
            application.setEligibilityScore(50);
            application.setEligibilityStatus("ELIGIBLE");
        }

        // Always keep in SUBMITTED state for Field/Verification Officer review
        application.setStatus(STATUS_SUBMITTED);

        Application saved = applicationRepository.saveAndFlush(application);

        try {
            if (notificationService != null && saved.getBeneficiary() != null) {
                String sName = saved.getScheme() != null ? saved.getScheme().getSchemeName() : "Welfare Scheme";
                notificationService.createNotification(
                        saved.getBeneficiary().getUserId(),
                        "Application Submitted Successfully",
                        "Your application (" + saved.getApplicationNumber() + ") for " + sName + " has been submitted and is under Front Desk review.",
                        "APPLICATION",
                        saved.getApplicationId()
                );
            }
        } catch (Exception ex) {
            System.err.println("Notification trigger note: " + ex.getMessage());
        }

        return "Application submitted successfully with ID: " + saved.getApplicationNumber();
    }

    @Autowired
    @org.springframework.context.annotation.Lazy
    private DisbursementService disbursementService;

    public List<Application> getVisibleApplications() {
        if (currentUserHasAnyRole("SUPER_ADMIN", "DEPT_ADMIN", "ADMIN", "SUPERADMIN", "DEPTADMIN")) {
            return applicationRepository.findAll();
        }
        if (currentUserHasAnyRole("VERIFICATION_OFFICER", "DISTRICT_OFFICER", "OFFICER", "ROLE_OFFICER", "VERIFICATION", "DISTRICT")) {
            return applicationRepository.findAll();
        }
        if (currentUserHasAnyRole("FRONT_DESK_OFFICER", "FIELD_OFFICER", "FRONT_DESK", "FIELD")) {
            return applicationRepository.findAll();
        }
        if (currentUserHasAnyRole("FINANCE_OFFICER", "FINANCE_APPROVER", "FINANCE")) {
            return applicationRepository.findByStatusIn(List.of(
                    STATUS_VERIFICATION_APPROVED, "PENDING_FINANCE", "APPROVED", "STAGE_RELEASED", "DISBURSED"
            ));
        }

        // Also check if current authenticated user has an officer record or officer role in database
        String mobile = currentPrincipalMobile();
        if (mobile != null) {
            User currentUser = userRepository.findBymobileNumber(mobile).orElse(null);
            if (currentUser != null) {
                String uRole = currentUser.getRole() != null ? currentUser.getRole().toUpperCase() : "";
                if (uRole.contains("ADMIN") || uRole.contains("OFFICER") || uRole.contains("VERIF") || uRole.contains("DISTRICT") || uRole.contains("FIELD") || uRole.contains("FRONT")) {
                    return applicationRepository.findAll();
                }
                boolean isOfficer = officerRepository.findByUser_UserId(currentUser.getUserId()).isPresent();
                if (isOfficer) {
                    return applicationRepository.findAll();
                }
            }
        }

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

        try {
            if (notificationService != null && application.getBeneficiary() != null) {
                notificationService.createNotification(
                        application.getBeneficiary().getUserId(),
                        "Application Resubmitted",
                        "Your updated application details have been re-submitted for officer verification.",
                        "APPLICATION",
                        application.getApplicationId()
                );
            }
        } catch (Exception ignored) {}

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

        try {
            if (notificationService != null && application.getBeneficiary() != null) {
                notificationService.createNotification(
                        application.getBeneficiary().getUserId(),
                        "Front Desk Review Cleared",
                        "Your application has passed front desk review and is now with the Verification Officer.",
                        "VERIFICATION",
                        application.getApplicationId()
                );
            }
        } catch (Exception ignored) {}

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

        try {
            if (notificationService != null && application.getBeneficiary() != null) {
                notificationService.createNotification(
                        application.getBeneficiary().getUserId(),
                        "Action Required: Application Returned",
                        "Your application was returned for correction: " + remarks,
                        "WARNING",
                        application.getApplicationId()
                );
            }
        } catch (Exception ignored) {}

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

        try {
            if (notificationService != null && application.getBeneficiary() != null) {
                notificationService.createNotification(
                        application.getBeneficiary().getUserId(),
                        "Application Status Update",
                        "Your application could not be approved: " + remarks,
                        "REJECTED",
                        application.getApplicationId()
                );
            }
        } catch (Exception ignored) {}

        return "Application rejected by Field Officer";
    }

    // ---------------------------------------------------------------
    // Verification Officer stage: PENDING_VERIFICATION / SUBMITTED -> ...
    // ---------------------------------------------------------------

    public String verifyApprove(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        
        String st = application.getStatus();
        if (STATUS_REJECTED.equalsIgnoreCase(st) || "DISBURSED".equalsIgnoreCase(st)) {
            return "Application cannot be approved from status: " + st;
        }

        application.setStatus(STATUS_VERIFICATION_APPROVED);
        application.setRemarks(remarks != null && !remarks.isBlank() ? remarks : "Approved by Verification Officer");
        applicationRepository.save(application);

        try {
            if (disbursementService != null) {
                disbursementService.initializeApplicationMilestones(application.getApplicationId());
            }
        } catch (Exception e) {
            // Milestone plan might not be configured yet or already initialized
        }

        try {
            if (notificationService != null && application.getBeneficiary() != null) {
                notificationService.createNotification(
                        application.getBeneficiary().getUserId(),
                        "Verification Approved",
                        "Your application has been verified and approved by the Verification Officer. Sent to Finance for grant disbursement.",
                        "VERIFICATION",
                        application.getApplicationId()
                );
            }
        } catch (Exception ignored) {}

        return "Application approved by Verification Officer and forwarded to Finance Officer for disbursement";
    }

    public String verifyReturn(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (remarks == null || remarks.isBlank()) {
            return "Remarks are mandatory when returning an application";
        }

        application.setStatus(STATUS_RETURNED);
        application.setRemarks(remarks);
        applicationRepository.save(application);

        try {
            if (notificationService != null && application.getBeneficiary() != null) {
                notificationService.createNotification(
                        application.getBeneficiary().getUserId(),
                        "Action Required: Application Returned",
                        "Officer verification note: " + remarks + ". Please correct and resubmit.",
                        "WARNING",
                        application.getApplicationId()
                );
            }
        } catch (Exception ignored) {}

        return "Application returned to beneficiary for corrections";
    }

    public String verifyReject(Integer id, String remarks) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) return "Application not found";
        if (remarks == null || remarks.isBlank()) {
            return "A rejection reason is mandatory";
        }

        application.setStatus(STATUS_REJECTED);
        application.setRejectionReason(remarks);
        applicationRepository.save(application);

        try {
            if (notificationService != null && application.getBeneficiary() != null) {
                notificationService.createNotification(
                        application.getBeneficiary().getUserId(),
                        "Application Rejected",
                        "Your application was not approved during verification: " + remarks,
                        "REJECTED",
                        application.getApplicationId()
                );
            }
        } catch (Exception ignored) {}

        return "Application rejected by Verification Officer";
    }

    private boolean isAtFieldStage(Application application) {
        return STATUS_SUBMITTED.equalsIgnoreCase(application.getStatus())
                || STATUS_RESUBMITTED.equalsIgnoreCase(application.getStatus());
    }
}
