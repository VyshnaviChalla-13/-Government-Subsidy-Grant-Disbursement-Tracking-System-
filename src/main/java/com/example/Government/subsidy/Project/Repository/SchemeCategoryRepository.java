package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.Scheme;
import com.example.Government.subsidy.Project.Entity.SchemeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SchemeCategoryRepository extends JpaRepository<SchemeCategory, Integer> {
    List<SchemeCategory> findByScheme(Scheme scheme);
}
