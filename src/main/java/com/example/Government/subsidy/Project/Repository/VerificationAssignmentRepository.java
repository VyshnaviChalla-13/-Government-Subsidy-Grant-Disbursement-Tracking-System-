package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.VerificationAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VerificationAssignmentRepository extends JpaRepository<VerificationAssignment, Integer> {
    Optional<VerificationAssignment> findByApplication_ApplicationId(Integer applicationId);
}
