package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.Scheme;
import com.example.Government.subsidy.Project.Entity.SchemeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchemeCategoryRepository extends JpaRepository<SchemeCategory, Integer> {

    List<SchemeCategory> findByScheme(Scheme scheme);

}