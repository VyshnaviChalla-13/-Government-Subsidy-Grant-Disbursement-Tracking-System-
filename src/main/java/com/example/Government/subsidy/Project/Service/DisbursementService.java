package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.DTO.OverdueMilestoneDTO;
import com.example.Government.subsidy.Project.DTO.StageConfigRequest;
import com.example.Government.subsidy.Project.Entity.*;
import com.example.Government.subsidy.Project.Exception.ApiException;
import com.example.Government.subsidy.Project.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DisbursementService {

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_COMPLETED = "COMPLETED";
    private static final String STATUS_RELEASED = "RELEASED";
    private static final String STATUS_OVERDUE = "OVERDUE";
    private static final String STATUS_REJECTED = "REJECTED";

    @Autowired private SchemeMilestoneRepository schemeMilestoneRepository;
    @Autowired private ApplicationMilestoneRepository applicationMilestoneRepository;
    @Autowired private PaymentTransactionRepository paymentTransactionRepository;
    @Autowired private PaymentAttemptRepository paymentAttemptRepository;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private OfficerRepository officerRepository;
    @Autowired private SchemeRepository schemeRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private NotificationService notificationService;

    private String currentPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "SYSTEM";
    }

    private Officer currentOfficer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String mobile = auth != null ? auth.getName() : null;
        return officerRepository.findAll().stream()
                .filter(o -> o.getUser() != null && mobile != null && mobile.equals(o.getUser().getMobileNumber()))
                .findFirst().orElse(null);
    }

    private void audit(String action, String entityType, Integer entityId, String details) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setPerformedBy(currentPrincipal());
        log.setDetails(details);
        auditLogRepository.save(log);
    }

    // ---------------------------------------------------------------
    // TASK 1 - Disbursement plan configuration & milestone scheduling
    // ---------------------------------------------------------------

    /**
     * POST /disbursement/plan/{schemeId}/configure
     * Bulk-configures every stage of a scheme's disbursement plan and
     * rejects the whole request (HTTP 400) if the stage amounts do not
     * sum exactly to the scheme's approved grant.
     *
     * NOTE on "approved grant": this codebase does not store a separate
     * per-application approved-grant-amount field, so Scheme.maxGrant
     * (the ceiling amount sanctioned for the scheme) is used as "the
     * total approved grant" the guide refers to. Stages are configured
     * once per scheme and then copied onto every beneficiary's
     * application via initializeApplicationMilestones().
     */
    @Transactional
    public List<SchemeMilestone> configurePlan(Integer schemeId, List<StageConfigRequest> stages) {
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> ApiException.notFound("Scheme not found"));

        if (stages == null || stages.isEmpty()) {
            throw ApiException.badRequest("At least one stage is required to configure a plan");
        }

        for (StageConfigRequest stage : stages) {
            if (stage.getMilestoneOrder() == null || stage.getMilestoneName() == null || stage.getAmount() == null) {
                throw ApiException.badRequest("Every stage requires milestoneOrder, milestoneName and amount");
            }
            if (stage.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw ApiException.badRequest("Stage amounts must be greater than zero");
            }
        }

        BigDecimal total = stages.stream()
                .map(StageConfigRequest::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal approvedGrant = scheme.getMaxGrant();
        if (approvedGrant == null || total.compareTo(approvedGrant) != 0) {
            throw ApiException.badRequest(
                    "Stage amounts sum to " + total + " but must sum exactly to the scheme's approved grant of " + approvedGrant);
        }

        // Refuse to silently wipe/replace a plan that beneficiaries are
        // already mid-way through - reconfigure only applies before any
        // application has been initialized against this scheme.
        if (!applicationMilestoneRepository.findByMilestone_Scheme_SchemeId(schemeId).isEmpty()) {
            throw ApiException.badRequest(
                    "This scheme's plan cannot be reconfigured: one or more applications already have stages initialized against it");
        }

        List<SchemeMilestone> existing = schemeMilestoneRepository.findByScheme_SchemeIdOrderByMilestoneOrderAsc(schemeId);
        if (!existing.isEmpty()) {
            schemeMilestoneRepository.deleteAll(existing);
        }

        List<SchemeMilestone> created = new ArrayList<>();
        for (StageConfigRequest stage : stages) {
            SchemeMilestone m = new SchemeMilestone();
            m.setScheme(scheme);
            m.setMilestoneOrder(stage.getMilestoneOrder());
            m.setMilestoneName(stage.getMilestoneName());
            m.setDescription(stage.getDescription());
            m.setAmount(stage.getAmount());
            m.setDueAfterDays(stage.getDueAfterDays());
            created.add(schemeMilestoneRepository.save(m));
        }

        audit("PLAN_CONFIGURED", "SCHEME", schemeId, created.size() + " stage(s) configured, total=" + total);
        return created;
    }

    /** Single-stage add, kept for convenience - does not validate the running total, use configurePlan for that. */
    public String addSchemeMilestone(Integer schemeId, String name, String description,
                                     Integer order, BigDecimal amount, Integer dueAfterDays) {
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> ApiException.notFound("Scheme not found"));
        SchemeMilestone m = new SchemeMilestone();
        m.setMilestoneOrder(order);
        m.setMilestoneName(name);
        m.setDescription(description);
        m.setAmount(amount);
        m.setDueAfterDays(dueAfterDays);
        m.setScheme(scheme);
        schemeMilestoneRepository.save(m);
        return "Milestone added to scheme";
    }

    @Transactional
    public String initializeApplicationMilestones(Integer applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> ApiException.notFound("Application not found"));

        List<SchemeMilestone> milestones = schemeMilestoneRepository
                .findByScheme_SchemeIdOrderByMilestoneOrderAsc(application.getScheme().getSchemeId());
        
        // If no predefined scheme milestones exist, create a default milestone for the full scheme grant
        if (milestones.isEmpty()) {
            Scheme scheme = application.getScheme();
            BigDecimal amount = scheme.getMaxGrant() != null ? scheme.getMaxGrant() : BigDecimal.valueOf(25000);
            
            SchemeMilestone defaultSm = new SchemeMilestone();
            defaultSm.setScheme(scheme);
            defaultSm.setMilestoneOrder(1);
            defaultSm.setMilestoneName("Direct Grant Subsidy");
            defaultSm.setDescription("Sanctioned grant disbursement");
            defaultSm.setAmount(amount);
            defaultSm.setDueAfterDays(7);
            defaultSm = schemeMilestoneRepository.save(defaultSm);
            milestones = List.of(defaultSm);
        }

        List<ApplicationMilestone> existing = applicationMilestoneRepository
                .findByApplication_ApplicationIdOrderByMilestone_MilestoneOrderAsc(applicationId);
        if (!existing.isEmpty()) {
            return "Application milestones already initialized: " + existing.size();
        }

        for (SchemeMilestone sm : milestones) {
            ApplicationMilestone am = new ApplicationMilestone();
            am.setApplication(application);
            am.setMilestone(sm);
            am.setStatus(STATUS_PENDING);
            am.setAmountToRelease(sm.getAmount());
            if (sm.getDueAfterDays() != null) {
                am.setDueDate(LocalDate.now().plusDays(sm.getDueAfterDays()));
            }
            applicationMilestoneRepository.save(am);
        }
        return "Application milestones initialized: " + milestones.size();
    }

    // ---------------------------------------------------------------
    // Stage completion - beneficiary/officer marks a stage's requirement done
    // ---------------------------------------------------------------

    public String completeMilestone(Integer applicationMilestoneId) {
        ApplicationMilestone am = applicationMilestoneRepository.findById(applicationMilestoneId)
                .orElseThrow(() -> ApiException.notFound("Application milestone not found"));

        if (STATUS_OVERDUE.equalsIgnoreCase(am.getStatus())) {
            throw ApiException.badRequest(
                    "This stage is OVERDUE. An administrator must resolve it via PUT /disbursement/milestone/"
                            + applicationMilestoneId + "/resolve before it can be completed.");
        }
        if (STATUS_RELEASED.equalsIgnoreCase(am.getStatus())) {
            return "Milestone is already RELEASED";
        }

        am.setStatus(STATUS_COMPLETED);
        am.setCompletedDate(LocalDate.now());
        applicationMilestoneRepository.save(am);
        return "Milestone marked COMPLETED and is ready for release";
    }

    // ---------------------------------------------------------------
    // TASK 1 - Release (the money movement itself)
    // ---------------------------------------------------------------

    /**
     * POST /disbursement/release/{applicationMilestoneId}
     * Releases funds for the specified application milestone.
     */
    @Transactional
    public String releaseStage(Integer applicationMilestoneId, String transactionReference) {
        ApplicationMilestone am = applicationMilestoneRepository.findById(applicationMilestoneId)
                .orElseThrow(() -> ApiException.notFound("Application milestone not found"));

        if (STATUS_RELEASED.equalsIgnoreCase(am.getStatus())) {
            return "Milestone has already been released";
        }

        Integer applicationId = am.getApplication().getApplicationId();
        Integer order = am.getMilestone() != null ? am.getMilestone().getMilestoneOrder() : 1;

        // Sequential block: Stage N cannot release unless Stage N-1 is RELEASED.
        if (order != null && order > 1) {
            applicationMilestoneRepository
                    .findByApplication_ApplicationIdAndMilestone_MilestoneOrder(applicationId, order - 1)
                    .ifPresent(previous -> {
                        if (!STATUS_RELEASED.equalsIgnoreCase(previous.getStatus())) {
                            throw ApiException.badRequest(
                                    "Stage " + order + " is blocked: Stage " + (order - 1) + " has not been released yet");
                        }
                    });
        }

        // Compliance block: any earlier stage still OVERDUE stops this release too.
        int boundary = order == null ? Integer.MAX_VALUE : order;
        boolean earlierOverdue = applicationMilestoneRepository
                .findByApplication_ApplicationIdAndMilestone_MilestoneOrderLessThan(applicationId, boundary)
                .stream()
                .anyMatch(m -> STATUS_OVERDUE.equalsIgnoreCase(m.getStatus()));
        if (earlierOverdue) {
            throw ApiException.badRequest(
                    "Release blocked: an earlier stage for this application is OVERDUE. Resolve it first via PUT /disbursement/milestone/{id}/resolve.");
        }

        BigDecimal amount = am.getAmountToRelease() != null ? am.getAmountToRelease() : 
                (am.getMilestone() != null && am.getMilestone().getAmount() != null ? am.getMilestone().getAmount() : BigDecimal.valueOf(25000));

        // (1) milestone status -> RELEASED
        am.setStatus(STATUS_RELEASED);
        am.setAmountReleased(amount);
        am.setReleaseDate(LocalDateTime.now());
        if (am.getCompletedDate() == null) {
            am.setCompletedDate(LocalDate.now());
        }
        applicationMilestoneRepository.save(am);

        // (2) scheme.budget_used += amount
        if (am.getMilestone() != null && am.getMilestone().getScheme() != null) {
            Scheme scheme = am.getMilestone().getScheme();
            BigDecimal currentUsed = scheme.getBudgetUsed() != null ? scheme.getBudgetUsed() : BigDecimal.ZERO;
            scheme.setBudgetUsed(currentUsed.add(amount));
            schemeRepository.save(scheme);
        }

        // (3) Update Application and Beneficiary User status to DISBURSED
        Application app = am.getApplication();
        if (app != null) {
            List<ApplicationMilestone> allMilestones = applicationMilestoneRepository
                    .findByApplication_ApplicationIdOrderByMilestone_MilestoneOrderAsc(app.getApplicationId());
            boolean allDone = allMilestones.stream()
                    .allMatch(m -> m.getApplicationMilestoneId().equals(am.getApplicationMilestoneId()) || STATUS_RELEASED.equalsIgnoreCase(m.getStatus()));

            if (allDone) {
                app.setStatus("DISBURSED");
            } else {
                app.setStatus("STAGE_RELEASED");
            }
            applicationRepository.save(app);

            User beneficiary = app.getBeneficiary();
            if (beneficiary != null) {
                beneficiary.setStatus("DISBURSED");
                userRepository.save(beneficiary);

                try {
                    String schemeTitle = app.getScheme() != null ? app.getScheme().getSchemeName() : "Welfare Grant";
                    notificationService.createNotification(
                            beneficiary.getUserId(),
                            "Grant Amount Disbursed",
                            "Your grant payment of ₹" + amount + " for " + schemeTitle + " has been successfully disbursed to your bank account.",
                            "DISBURSEMENT",
                            app.getApplicationId()
                    );
                } catch (Exception notifEx) {
                    System.err.println("Failed to send disbursement notification: " + notifEx.getMessage());
                }
            }
        }

        // (4) Payment trail
        String ref = transactionReference != null && !transactionReference.isBlank()
                ? transactionReference : "TXN-" + System.currentTimeMillis();

        Officer financeOfficer = currentOfficer();
        PaymentTransaction payment = new PaymentTransaction();
        payment.setApplicationMilestone(am);
        payment.setFinanceOfficer(financeOfficer);
        payment.setAmount(amount);
        payment.setPaymentStatus("SUCCESS");
        payment.setPaymentDate(LocalDateTime.now());
        paymentTransactionRepository.save(payment);

        PaymentAttempt attempt = new PaymentAttempt();
        attempt.setPayment(payment);
        attempt.setAttemptNumber(1);
        attempt.setTransactionReference(ref);
        attempt.setStatus("SUCCESS");
        paymentAttemptRepository.save(attempt);

        // (5) audit_log entry
        audit("DISBURSEMENT_RELEASE", "APPLICATION_MILESTONE", applicationMilestoneId,
                "Released " + amount + " for stage " + order + " of application " + applicationId + " (Ref: " + ref + ")");

        return "Stage " + order + " released successfully: ₹" + amount;
    }

    /**
     * Direct application-level disbursement: initializes milestones if missing and releases all stages.
     */
    @Transactional
    public String disburseApplication(Integer applicationId, String transactionReference) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> ApiException.notFound("Application not found"));

        List<ApplicationMilestone> milestones = applicationMilestoneRepository
                .findByApplication_ApplicationIdOrderByMilestone_MilestoneOrderAsc(applicationId);

        if (milestones.isEmpty()) {
            initializeApplicationMilestones(applicationId);
            milestones = applicationMilestoneRepository
                    .findByApplication_ApplicationIdOrderByMilestone_MilestoneOrderAsc(applicationId);
        }

        String lastResult = "Disbursed";
        for (ApplicationMilestone m : milestones) {
            if (!STATUS_RELEASED.equalsIgnoreCase(m.getStatus())) {
                lastResult = releaseStage(m.getApplicationMilestoneId(), transactionReference);
            }
        }

        app.setStatus("DISBURSED");
        applicationRepository.save(app);

        User beneficiary = app.getBeneficiary();
        if (beneficiary != null) {
            beneficiary.setStatus("DISBURSED");
            userRepository.save(beneficiary);
        }

        return lastResult;
    }

    public String rejectMilestone(Integer applicationMilestoneId, String reason) {
        if (reason == null || reason.isBlank()) {
            throw ApiException.badRequest("Rejection reason is mandatory");
        }
        ApplicationMilestone am = applicationMilestoneRepository.findById(applicationMilestoneId)
                .orElseThrow(() -> ApiException.notFound("Application milestone not found"));
        am.setStatus(STATUS_REJECTED);
        applicationMilestoneRepository.save(am);
        audit("MILESTONE_REJECTED", "APPLICATION_MILESTONE", applicationMilestoneId, reason);
        return "Milestone rejected: " + reason;
    }

    public List<ApplicationMilestone> getMilestonesForApplication(Integer applicationId) {
        return applicationMilestoneRepository
                .findByApplication_ApplicationIdOrderByMilestone_MilestoneOrderAsc(applicationId);
    }

    public List<ApplicationMilestone> getPendingFinanceQueue() {
        return applicationMilestoneRepository.findByStatusIn(List.of(STATUS_PENDING, STATUS_COMPLETED, STATUS_OVERDUE));
    }

    // ---------------------------------------------------------------
    // TASK 2 - Admin override for an OVERDUE stage
    // ---------------------------------------------------------------

    /** PUT /disbursement/milestone/{id}/resolve */
    @Transactional
    public String resolveOverdue(Integer applicationMilestoneId, String reason) {
        if (reason == null || reason.isBlank()) {
            throw ApiException.badRequest("A resolution reason is mandatory");
        }
        ApplicationMilestone am = applicationMilestoneRepository.findById(applicationMilestoneId)
                .orElseThrow(() -> ApiException.notFound("Application milestone not found"));

        if (!STATUS_OVERDUE.equalsIgnoreCase(am.getStatus())) {
            throw ApiException.badRequest("Only an OVERDUE milestone can be resolved (current status: " + am.getStatus() + ")");
        }

        am.setStatus(STATUS_COMPLETED);
        am.setCompletedDate(LocalDate.now());
        am.setResolvedReason(reason);
        am.setResolvedBy(currentPrincipal());
        am.setResolvedAt(LocalDateTime.now());
        applicationMilestoneRepository.save(am);

        audit("OVERDUE_RESOLVED", "APPLICATION_MILESTONE", applicationMilestoneId, reason);
        return "Overdue milestone resolved. The next stage can now be released.";
    }

    // ---------------------------------------------------------------
    // TASK 2 - Non-compliance report (GET /reports/overdue)
    // ---------------------------------------------------------------

    public List<OverdueMilestoneDTO> getOverdueReport() {
        LocalDate today = LocalDate.now();
        return applicationMilestoneRepository.findByStatusOrderByDueDateAsc(STATUS_OVERDUE).stream()
                .map(am -> {
                    Application app = am.getApplication();
                    long daysOverdue = am.getDueDate() != null ? ChronoUnit.DAYS.between(am.getDueDate(), today) : 0;
                    return new OverdueMilestoneDTO(
                            am.getApplicationMilestoneId(),
                            app != null ? app.getApplicationId() : null,
                            app != null ? app.getApplicationNumber() : null,
                            app != null && app.getBeneficiary() != null ? app.getBeneficiary().getFullName() : null,
                            am.getMilestone() != null && am.getMilestone().getScheme() != null
                                    ? am.getMilestone().getScheme().getSchemeName() : null,
                            am.getMilestone() != null ? am.getMilestone().getMilestoneName() : null,
                            am.getAmountToRelease(),
                            am.getDueDate(),
                            Math.max(daysOverdue, 0)
                    );
                })
                .sorted(Comparator.comparingLong(OverdueMilestoneDTO::daysOverdue).reversed())
                .toList();
    }
}
