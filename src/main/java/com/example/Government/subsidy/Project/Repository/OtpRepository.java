package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findByMobileNumber(String mobileNumber);

    void deleteByMobileNumber(String mobileNumber);
}