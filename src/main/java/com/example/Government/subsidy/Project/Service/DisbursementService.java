package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.*;
import com.example.Government.subsidy.Project.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DisbursementService {

    @Autowired private SchemeMilestoneRepository schemeMilestoneRepository;
    @Autowired private ApplicationMilestoneRepository applicationMilestoneRepository;
    @Autowired private PaymentTransactionRepository paymentTransactionRepository;
    @Autowired private PaymentAttemptRepository paymentAttemptRepository;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private OfficerRepository officerRepository;

    private Officer currentOfficer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String mobile = auth != null ? auth.getName() : null;
        return officerRepository.findAll().stream()
                .filter(o -> o.getUser() != null && mobile != null && mobile.equals(o.getUser().getMobileNumber()))
                .findFirst().orElse(null);
    }

    public String addSchemeMilestone(Integer schemeId, String name, String description,
                                      Integer order, java.math.BigDecimal amount, Integer dueAfterDays) {
        SchemeMilestone m = new SchemeMilestone();
        m.setMilestoneOrder(order);
        m.setMilestoneName(name);
        m.setDescription(description);
        m.setAmount(amount);
        m.setDueAfterDays(dueAfterDays);
        Scheme scheme = new Scheme();
        scheme.setSchemeId(schemeId);
        m.setScheme(scheme);
        schemeMilestoneRepository.save(m);
        return "Milestone added to scheme";
    }

    @Transactional
    public String initializeApplicationMilestones(Integer applicationId) {
        Application application = applicationRepository.findById(applicationId).orElse(null);
        if (application == null) return "Application not found";

        List<SchemeMilestone> milestones = schemeMilestoneRepository
                .findByScheme_SchemeIdOrderByMilestoneOrderAsc(application.getScheme().getSchemeId());
        if (milestones.isEmpty()) return "No milestones configured for this scheme";

        for (SchemeMilestone sm : milestones) {
            ApplicationMilestone am = new ApplicationMilestone();
            am.setApplication(application);
            am.setMilestone(sm);
            am.setStatus("PENDING");
            if (sm.getDueAfterDays() != null) {
                am.setDueDate(LocalDate.now().plusDays(sm.getDueAfterDays()));
            }
            applicationMilestoneRepository.save(am);
        }
        return "Application milestones initialized: " + milestones.size();
    }

    public String submitMilestone(Integer applicationMilestoneId) {
        ApplicationMilestone am = applicationMilestoneRepository.findById(applicationMilestoneId).orElse(null);
        if (am == null) return "Application milestone not found";
        if (!"PENDING".equalsIgnoreCase(am.getStatus())) return "Milestone is not pending";
        am.setStatus("SUBMITTED");
        am.setCompletedDate(LocalDate.now());
        applicationMilestoneRepository.save(am);
        return "Milestone submitted for finance review";
    }

    @Transactional
    public String approveAndDisburse(Integer applicationMilestoneId, String transactionReference) {
        ApplicationMilestone am = applicationMilestoneRepository.findById(applicationMilestoneId).orElse(null);
        if (am == null) return "Application milestone not found";
        if (!"SUBMITTED".equalsIgnoreCase(am.getStatus())) return "Milestone is not awaiting approval";

        Officer financeOfficer = currentOfficer();
        if (financeOfficer == null) return "Finance officer profile not found";

        PaymentTransaction payment = new PaymentTransaction();
        payment.setApplicationMilestone(am);
        payment.setFinanceOfficer(financeOfficer);
        payment.setAmount(am.getMilestone().getAmount());
        payment.setPaymentStatus("SUCCESS");
        payment.setPaymentDate(LocalDateTime.now());
        paymentTransactionRepository.save(payment);

        PaymentAttempt attempt = new PaymentAttempt();
        attempt.setPayment(payment);
        attempt.setAttemptNumber(1);
        attempt.setTransactionReference(transactionReference);
        attempt.setStatus("SUCCESS");
        paymentAttemptRepository.save(attempt);

        am.setStatus("PAID");
        applicationMilestoneRepository.save(am);

        return "Milestone approved and disbursed successfully";
    }

    public String rejectMilestone(Integer applicationMilestoneId, String reason) {
        ApplicationMilestone am = applicationMilestoneRepository.findById(applicationMilestoneId).orElse(null);
        if (am == null) return "Application milestone not found";
        if (reason == null || reason.isBlank()) return "Rejection reason is mandatory";
        am.setStatus("REJECTED");
        applicationMilestoneRepository.save(am);
        return "Milestone rejected: " + reason;
    }

    public List<ApplicationMilestone> getMilestonesForApplication(Integer applicationId) {
        return applicationMilestoneRepository
                .findByApplication_ApplicationIdOrderByMilestone_MilestoneOrderAsc(applicationId);
    }

    public List<ApplicationMilestone> getPendingFinanceQueue() {
        return applicationMilestoneRepository.findByStatus("SUBMITTED");
    }
}
