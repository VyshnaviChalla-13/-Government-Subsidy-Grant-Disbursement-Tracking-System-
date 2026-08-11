package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.ApplicationMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationMilestoneRepository extends JpaRepository<ApplicationMilestone, Integer> {
    List<ApplicationMilestone> findByApplication_ApplicationIdOrderByMilestone_MilestoneOrderAsc(Integer applicationId);
    List<ApplicationMilestone> findByStatus(String status);
}
