package com.example.Government.subsidy.Project.Repository;


import com.example.Government.subsidy.Project.Entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SchemeRepository extends JpaRepository<Scheme,Integer> {

    Optional<Scheme> findBySchemeName(String schemeName);

    boolean existsBySchemeName(String schemeName);

    List<Scheme> findByStatus(String status);
}