package com.example.Government.subsidy.Project.Service;

import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioVerifyService {

    @Value("${twilio.verify.service.sid}")
    private String verifyServiceSid;


    // Send OTP
    public String sendVerification(String mobileNumber) {

        try {

            Verification verification =
                    Verification.creator(
                            verifyServiceSid,
                            mobileNumber,
                            "sms"
                    ).create();

            return verification.getStatus();

        } catch (Exception e) {

            System.out.println(
                    "Twilio Send OTP Error: "
                            + e.getMessage()
            );

            return "failed";
        }
    }

    // Verify OTP
    public String checkVerification(
            String mobileNumber,
            String otp
    ) {
        try {

            VerificationCheck verificationCheck =
                    VerificationCheck.creator(
                                    verifyServiceSid
                            )
                            .setTo(mobileNumber)
                            .setCode(otp)
                            .create();

            return verificationCheck.getStatus();

        } catch (Exception e) {

            System.out.println(
                    "Twilio Verify Error: "
                            + e.getMessage()
            );

            return "Invalid or expired OTP";
        }
    }
}