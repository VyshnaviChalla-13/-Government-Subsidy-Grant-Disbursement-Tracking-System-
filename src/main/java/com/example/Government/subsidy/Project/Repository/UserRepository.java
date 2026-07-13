package com.example.Government.subsidy.Project.Repository;
import com.example.Government.subsidy.Project.Entity.userRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<userRegistration, Integer> {

    Optional<userRegistration> findByEmail(String email);

    Optional<userRegistration> findBymobileNumber(String mobileNumber);

    Optional<userRegistration> findByAadhaarNumber(String aadhaarNumber);

    boolean existsByEmail(String email);

    boolean existsBymobileNumber(String mobileNumber);

    boolean existsByAadhaarNumber(String aadhaarNumber);
}
