package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.PasswordResetVerification;
import com.example.Government.subsidy.Project.Entity.User;
import com.example.Government.subsidy.Project.Repository.PasswordResetVerificationRepository;
import com.example.Government.subsidy.Project.Repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetVerificationRepository
            passwordResetVerificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TwilioVerifyService twilioVerifyService;

    @Autowired
    private AuditLogService auditLogService;


    // =====================================================
    // SEND OTP
    // =====================================================

    @Transactional
    public String sendOtp(String mobileNumber) {

        String formattedNumber =
                formatIndianMobileNumber(mobileNumber);

        Optional<User> optionalUser =
                userRepository.findBymobileNumber(mobileNumber);

        if (optionalUser.isEmpty()) {
            return "Mobile number not registered";
        }

        User user = optionalUser.get();

        String status =
                twilioVerifyService.sendVerification(
                        formattedNumber
                );

        if ("pending".equalsIgnoreCase(status)) {

            // Remove old verification record
            passwordResetVerificationRepository
                    .deleteByMobileNumber(formattedNumber);

            auditLogService.log(
                    user.getUserId(),
                    user.getFullName(),
                    user.getRole(),
                    "OTP_REQUESTED",
                    "PASSWORD_RESET",
                    "Password reset OTP requested",
                    "SUCCESS",
                    null
            );

            return "OTP sent successfully";
        }

        return "Failed to send OTP";
    }


    // =====================================================
    // VERIFY OTP
    // =====================================================

    @Transactional
    public String verifyOtp(
            String mobileNumber,
            String otp
    ) {

        String formattedNumber =
                formatIndianMobileNumber(mobileNumber);

        String status =
                twilioVerifyService.checkVerification(
                        formattedNumber,
                        otp
                );

        System.out.println(
                "Twilio verification status: " + status
        );

        if ("approved".equalsIgnoreCase(status)) {

            // Delete old verification record
            passwordResetVerificationRepository
                    .deleteByMobileNumber(formattedNumber);

            PasswordResetVerification verification =
                    new PasswordResetVerification();

            verification.setMobileNumber(formattedNumber);

            verification.setVerifiedAt(
                    LocalDateTime.now()
            );

            verification.setExpiresAt(
                    LocalDateTime.now().plusMinutes(5)
            );

            PasswordResetVerification saved =
                    passwordResetVerificationRepository
                            .save(verification);

            System.out.println(
                    "Verification record saved. ID = "
                            + saved.getId()
            );

            return "OTP Verified";
        }

        return "Invalid OTP";
    }


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    @Transactional
    public String resetPassword(
            String mobileNumber,
            String newPassword
    ) {

        String formattedNumber =
                formatIndianMobileNumber(mobileNumber);


        // =================================================
        // CHECK OTP VERIFICATION
        // =================================================

        Optional<PasswordResetVerification>
                optionalVerification =
                passwordResetVerificationRepository
                        .findByMobileNumber(formattedNumber);

        if (optionalVerification.isEmpty()) {

            return "OTP verification required";
        }


        PasswordResetVerification verification =
                optionalVerification.get();


        // =================================================
        // CHECK EXPIRY
        // =================================================

        if (verification.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            passwordResetVerificationRepository
                    .deleteByMobileNumber(formattedNumber);

            return "OTP verification expired";
        }


        // =================================================
        // FIND USER
        // =================================================

        Optional<User> optionalUser =
                userRepository.findBymobileNumber(mobileNumber);

        if (optionalUser.isEmpty()) {

            return "User not found";
        }

        User user = optionalUser.get();


        // =================================================
        // CHANGE PASSWORD
        // =================================================

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);


        // =================================================
        // AUDIT LOG
        // =================================================

        auditLogService.log(
                user.getUserId(),
                user.getFullName(),
                user.getRole(),
                "PASSWORD_RESET",
                "USER_ACCOUNT",
                "Password reset successfully using OTP",
                "SUCCESS",
                null
        );


        // =================================================
        // CONSUME OTP VERIFICATION
        // =================================================

        passwordResetVerificationRepository
                .deleteByMobileNumber(formattedNumber);


        return "Password changed successfully";
    }


    // =====================================================
    // FORMAT INDIAN MOBILE NUMBER
    // =====================================================

    private String formatIndianMobileNumber(
            String mobileNumber
    ) {

        mobileNumber = mobileNumber.trim();

        // +918985028555
        if (mobileNumber.startsWith("+91")) {

            return mobileNumber;
        }

        // 918985028555
        if (mobileNumber.startsWith("91")
                && mobileNumber.length() == 12) {

            return "+" + mobileNumber;
        }

        // 8985028555
        if (mobileNumber.length() == 10) {

            return "+91" + mobileNumber;
        }

        throw new IllegalArgumentException(
                "Invalid Indian mobile number"
        );
    }
}