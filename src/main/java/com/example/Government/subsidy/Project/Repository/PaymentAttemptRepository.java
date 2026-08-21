package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.PaymentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentAttemptRepository extends JpaRepository<PaymentAttempt, Integer> {
}
