package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.Otp;
import com.example.Government.subsidy.Project.Entity.userRegistration;
import com.example.Government.subsidy.Project.Repository.OtpRepository;
import com.example.Government.subsidy.Project.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String sendOtp(String mobileNumber) {

        Optional<userRegistration> user =
                userRepository.findBymobileNumber(mobileNumber);

        if (user.isEmpty()) {
            return "Mobile number not registered";
        }

        otpRepository.deleteByMobileNumber(mobileNumber);

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        Otp otpEntity = new Otp();
        otpEntity.setMobileNumber(mobileNumber);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otpEntity);

        System.out.println("=================================");
        System.out.println("OTP : " + otp);
        System.out.println("=================================");

        return "OTP sent successfully";
    }

    public String verifyOtp(String mobileNumber, String otp) {

        Optional<Otp> optionalOtp =
                otpRepository.findByMobileNumber(mobileNumber);

        if (optionalOtp.isEmpty()) {
            return "OTP not found";
        }

        Otp savedOtp = optionalOtp.get();

        if (savedOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            return "OTP Expired";
        }

        if (!savedOtp.getOtp().equals(otp)) {
            return "Invalid OTP";
        }

        return "OTP Verified";
    }

    public String resetPassword(String mobileNumber, String newPassword) {

        Optional<userRegistration> optionalUser =
                userRepository.findBymobileNumber(mobileNumber);

        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        userRegistration user = optionalUser.get();

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        otpRepository.deleteByMobileNumber(mobileNumber);

        return "Password changed successfully";
    }
}
