package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    Optional<Application> findByApplicationNumber(String applicationNumber);

    List<Application> findByBeneficiary_UserId(Integer userId);

    List<Application> findByScheme_SchemeId(Integer schemeId);

    List<Application> findByStatus(String status);

    List<Application> findByBeneficiary_AadhaarNumberContaining(String aadhaar);

    List<Application> findByBeneficiary_FullNameContainingIgnoreCase(String name);
}
