package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.*;
import com.example.Government.subsidy.Project.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VerificationService {

    @Autowired private VerificationAssignmentRepository assignmentRepository;
    @Autowired private VerificationReviewRepository reviewRepository;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private OfficerRepository officerRepository;

    private String currentMobile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    public String assign(Integer applicationId, Integer fieldOfficerId, Integer districtOfficerId) {
        Application application = applicationRepository.findById(applicationId).orElse(null);
        if (application == null) return "Application not found";

        VerificationAssignment assignment = new VerificationAssignment();
        assignment.setApplication(application);
        if (fieldOfficerId != null) {
            Officer fo = officerRepository.findById(fieldOfficerId).orElse(null);
            if (fo == null) return "Field officer not found";
            assignment.setFieldOfficer(fo);
        }
        if (districtOfficerId != null) {
            Officer dO = officerRepository.findById(districtOfficerId).orElse(null);
            if (dO == null) return "District officer not found";
            assignment.setDistrictOfficer(dO);
        }
        assignmentRepository.save(assignment);
        return "Verification assignment created";
    }

    private boolean isAssignedOfficer(VerificationAssignment a, String stage) {
        String mobile = currentMobile();
        if ("FIELD".equalsIgnoreCase(stage)) {
            return a.getFieldOfficer() != null && mobile.equals(a.getFieldOfficer().getUser().getMobileNumber());
        }
        return a.getDistrictOfficer() != null && mobile.equals(a.getDistrictOfficer().getUser().getMobileNumber());
    }

    public String review(Integer applicationId, String stage, String action, String remarks, Integer rejectionReasonId) {
        Application application = applicationRepository.findById(applicationId).orElse(null);
        if (application == null) return "Application not found";

        VerificationAssignment assignment = assignmentRepository
                .findByApplication_ApplicationId(applicationId).orElse(null);
        if (assignment == null) return "No verification assignment found for this application";

        if (!isAssignedOfficer(assignment, stage)) return "You are not assigned to this application";

        if (("RETURN".equalsIgnoreCase(action) || "REJECT".equalsIgnoreCase(action))
                && (remarks == null || remarks.isBlank())) {
            return "Remarks are mandatory for return/reject";
        }

        VerificationReview review = new VerificationReview();
        review.setApplication(application);
        review.setAssignment(assignment);
        review.setStage(stage.toUpperCase());
        review.setAction(action.toUpperCase());
        review.setRemarks(remarks);
        review.setRejectionReasonId(rejectionReasonId);
        reviewRepository.save(review);

        String newStatus = switch (action.toUpperCase()) {
            case "APPROVE" -> "FIELD".equalsIgnoreCase(stage) ? "FIELD_APPROVED" : "VERIFICATION_APPROVED";
            case "RETURN" -> "RETURNED";
            case "REJECT" -> "REJECTED";
            default -> application.getStatus();
        };
        application.setStatus(newStatus);
        application.setRemarks(remarks);
        applicationRepository.save(application);

        return "Review recorded: " + action.toUpperCase();
    }

    public List<VerificationReview> getHistory(Integer applicationId) {
        return reviewRepository.findByApplication_ApplicationIdOrderByReviewedAtAsc(applicationId);
    }
}
