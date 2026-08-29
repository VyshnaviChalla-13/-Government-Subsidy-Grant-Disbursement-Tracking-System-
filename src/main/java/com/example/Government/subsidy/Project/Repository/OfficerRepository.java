package com.example.Government.subsidy.Project.Repository;


import com.example.Government.subsidy.Project.Entity.Officer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OfficerRepository extends JpaRepository<Officer, Integer> {

    Optional<Officer> findByEmployeeCode(String employeeCode);

    boolean existsByEmployeeCode(String employeeCode);

    Optional<Officer> findByUser_UserId(Integer userId);
}
