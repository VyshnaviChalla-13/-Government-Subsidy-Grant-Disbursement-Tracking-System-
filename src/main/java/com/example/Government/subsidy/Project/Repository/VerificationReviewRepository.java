package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.VerificationReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VerificationReviewRepository extends JpaRepository<VerificationReview, Integer> {
    List<VerificationReview> findByApplication_ApplicationIdOrderByReviewedAtAsc(Integer applicationId);
}
