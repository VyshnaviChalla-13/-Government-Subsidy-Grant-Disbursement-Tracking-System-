package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Entity.VerificationReview;
import com.example.Government.subsidy.Project.Service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/verifications")
@CrossOrigin(origins = "*")
public class VerificationController {

    @Autowired private VerificationService verificationService;

    @PostMapping("/{applicationId}/assign")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN')")
    public String assign(@PathVariable Integer applicationId,
                          @RequestParam(required = false) Integer fieldOfficerId,
                          @RequestParam(required = false) Integer districtOfficerId) {
        return verificationService.assign(applicationId, fieldOfficerId, districtOfficerId);
    }

    @PatchMapping("/{applicationId}/review")
    @PreAuthorize("hasAnyRole('FRONT_DESK_OFFICER','VERIFICATION_OFFICER')")
    public String review(@PathVariable Integer applicationId,
                          @RequestParam String stage,
                          @RequestParam String action,
                          @RequestParam(required = false) String remarks,
                          @RequestParam(required = false) Integer rejectionReasonId) {
        return verificationService.review(applicationId, stage, action, remarks, rejectionReasonId);
    }

    @GetMapping("/{applicationId}/history")
    public List<VerificationReview> history(@PathVariable Integer applicationId) {
        return verificationService.getHistory(applicationId);
    }
}
