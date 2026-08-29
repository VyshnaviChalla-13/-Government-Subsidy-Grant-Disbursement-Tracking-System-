package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Integer> {
}
