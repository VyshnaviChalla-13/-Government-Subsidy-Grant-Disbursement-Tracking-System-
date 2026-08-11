package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.SchemeMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SchemeMilestoneRepository extends JpaRepository<SchemeMilestone, Integer> {
    List<SchemeMilestone> findByScheme_SchemeIdOrderByMilestoneOrderAsc(Integer schemeId);
}
