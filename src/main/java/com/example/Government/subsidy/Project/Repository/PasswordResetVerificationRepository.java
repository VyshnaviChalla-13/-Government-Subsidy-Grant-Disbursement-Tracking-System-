package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.PasswordResetVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface PasswordResetVerificationRepository
        extends JpaRepository<PasswordResetVerification, Long> {

    Optional<PasswordResetVerification>
    findByMobileNumber(String mobileNumber);

    @Transactional
    void deleteByMobileNumber(String mobileNumber);
}