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

    @Autowired
    private VerificationAssignmentRepository assignmentRepository;

    @Autowired
    private VerificationReviewRepository reviewRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private OfficerRepository officerRepository;

    @Autowired
    private NotificationService notificationService;
 
    private String currentMobile() {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return auth != null ? auth.getName() : null;
    }

    public String assign(
            Integer applicationId,
            Integer fieldOfficerId,
            Integer districtOfficerId) {

        Application application =
                applicationRepository
                        .findById(applicationId)
                        .orElse(null);

        if (application == null) {
            return "Application not found";
        }


        VerificationAssignment assignment =
                new VerificationAssignment();

        assignment.setApplication(application);

        if (fieldOfficerId != null) {

            Officer fieldOfficer =
                    officerRepository
                            .findById(fieldOfficerId)
                            .orElse(null);

            if (fieldOfficer == null) {
                return "Field officer not found";
            }

            assignment.setFieldOfficer(fieldOfficer);
        }

        if (districtOfficerId != null) {

            Officer districtOfficer =
                    officerRepository
                            .findById(districtOfficerId)
                            .orElse(null);

            if (districtOfficer == null) {
                return "District officer not found";
            }

            assignment.setDistrictOfficer(districtOfficer);
        }


        assignmentRepository.save(assignment);


        return "Verification assignment created";
    }

    private boolean isAssignedOfficer(
            VerificationAssignment assignment,
            String stage) {

        String mobile = currentMobile();

        if (mobile == null) {
            return false;
        }


        // FIELD OFFICER
        if ("FIELD".equalsIgnoreCase(stage)) {

            return assignment.getFieldOfficer() != null
                    && assignment
                    .getFieldOfficer()
                    .getUser()
                    .getMobileNumber()
                    .equals(mobile);
        }


        // DISTRICT / VERIFICATION OFFICER
        return assignment.getDistrictOfficer() != null
                && assignment
                .getDistrictOfficer()
                .getUser()
                .getMobileNumber()
                .equals(mobile);
    }

    public String review(
            Integer applicationId,
            String stage,
            String action,
            String remarks,
            Integer rejectionReasonId) {

        Application application =
                applicationRepository
                        .findById(applicationId)
                        .orElse(null);

        if (application == null) {
            return "Application not found";
        }

        VerificationAssignment assignment =
                assignmentRepository
                        .findByApplication_ApplicationId(
                                applicationId)
                        .orElse(null);

        if (assignment == null) {
            return "No verification assignment found for this application";
        }

        if (!isAssignedOfficer(
                assignment,
                stage)) {

            return "You are not assigned to this application";
        }

        if (action == null || action.isBlank()) {

            return "Action is required";
        }


        if (stage == null || stage.isBlank()) {

            return "Stage is required";
        }

        action = action.toUpperCase();

        stage = stage.toUpperCase();

        if (("RETURN".equals(action)
                || "REJECT".equals(action))
                &&
                (remarks == null
                        || remarks.isBlank())) {

            return "Remarks are mandatory for return/reject";
        }

        VerificationReview review =
                new VerificationReview();

        review.setApplication(application);

        review.setAssignment(assignment);

        review.setStage(stage);

        review.setAction(action);

        review.setRemarks(remarks);

        review.setRejectionReasonId(
                rejectionReasonId);


        reviewRepository.save(review);

        String newStatus;


        switch (action) {

            case "APPROVE":

                if ("FIELD".equals(stage)) {

                    newStatus = "FIELD_APPROVED";

                } else {

                    newStatus = "VERIFICATION_APPROVED";
                }

                break;


            case "RETURN":

                newStatus = "RETURNED";

                break;


            case "REJECT":

                newStatus = "REJECTED";

                break;


            default:

                return "Invalid action. Use APPROVE, RETURN or REJECT";
        }


        application.setStatus(newStatus);

        application.setRemarks(remarks);

        applicationRepository.save(application);

        User beneficiary =
                application.getBeneficiary();


        if (beneficiary == null) {

            return "Review recorded, but beneficiary not found";
        }

        createBeneficiaryNotification(
                beneficiary,
                application,
                stage,
                action,
                remarks
        );


        return "Review recorded: " + action;
    }


    private void createBeneficiaryNotification(
            User beneficiary,
            Application application,
            String stage,
            String action,
            String remarks) {


        String applicationNumber =
                application.getApplicationNumber();


        String title;

        String message;

        String type;

        if ("APPROVE".equals(action)) {


            if ("FIELD".equals(stage)) {

                title =
                        "Field Verification Approved";

                message =
                        "Your application "
                                + applicationNumber
                                + " has been approved by the field officer.";

                type =
                        "FIELD_APPROVED";


            } else {

                title =
                        "District Verification Approved";

                message =
                        "Your application "
                                + applicationNumber
                                + " has been approved by the district verification officer.";

                type =
                        "VERIFICATION_APPROVED";
            }

        } else if ("RETURN".equals(action)) {

            title =
                    "Correction Required";

            message =
                    "Your application "
                            + applicationNumber
                            + " has been returned for correction.";

            if (remarks != null
                    && !remarks.isBlank()) {

                message +=
                        " Reason: " + remarks;
            }

            type =
                    "APPLICATION_RETURNED";

        } else {

            title =
                    "Application Rejected";

            message =
                    "Your application "
                            + applicationNumber
                            + " has been rejected.";

            if (remarks != null
                    && !remarks.isBlank()) {

                message +=
                        " Reason: " + remarks;
            }

            type =
                    "APPLICATION_REJECTED";
        }

        notificationService.createNotification(

                beneficiary.getUserId(),

                title,

                message,

                type,

                application.getApplicationId()
        );
    }

    public List<VerificationReview> getHistory(
            Integer applicationId) {

        return reviewRepository
                .findByApplication_ApplicationIdOrderByReviewedAtAsc(
                        applicationId);
    }
}
