package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String mobileNumber) {
        return otpService.sendOtp(mobileNumber);
    }

    @PostMapping("/verify")
    public String verifyOtp(@RequestParam String mobileNumber,
                            @RequestParam String otp) {
        return otpService.verifyOtp(mobileNumber, otp);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String mobileNumber,
                                @RequestParam String newPassword) {
        return otpService.resetPassword(mobileNumber, newPassword);
    }
}