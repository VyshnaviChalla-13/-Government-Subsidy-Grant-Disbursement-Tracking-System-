package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Integer> {
}
