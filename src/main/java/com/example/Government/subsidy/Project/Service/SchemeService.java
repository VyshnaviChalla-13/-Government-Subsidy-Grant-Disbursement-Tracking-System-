package com.example.Government.subsidy.Project.Service;
import com.example.Government.subsidy.Project.Entity.Department;
import com.example.Government.subsidy.Project.Entity.Scheme;
import com.example.Government.subsidy.Project.Entity.User;
import com.example.Government.subsidy.Project.Repository.DepartmentRepository;
import com.example.Government.subsidy.Project.Repository.SchemeRepository;
import com.example.Government.subsidy.Project.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchemeService {

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    public String createScheme(Scheme scheme) {
        if (scheme.getSchemeName() == null || scheme.getSchemeName().trim().isEmpty()) {
            return "Scheme name is required";
        }

        if (schemeRepository.existsBySchemeName(scheme.getSchemeName().trim())) {
            return "Scheme already exists";
        }

        if (scheme.getDepartment() == null || scheme.getDepartment().getDepartmentId() == null) {
            return "Department is required";
        }

        Department department = departmentRepository.findById(
                scheme.getDepartment().getDepartmentId()
        ).orElse(null);

        if (department == null) {
            return "Department not found";
        }

        User user = null;
        if (scheme.getUser() != null && scheme.getUser().getUserId() != null) {
            user = userRepository.findById(scheme.getUser().getUserId()).orElse(null);
        }

        if (user == null) {
            // Try resolving from Security Context
            org.springframework.security.core.Authentication auth =
                    org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null) {
                user = userRepository.findBymobileNumber(auth.getName()).orElse(null);
            }
        }

        if (user == null) {
            // Fallback to any admin or officer user
            user = userRepository.findAll().stream()
                    .filter(u -> u.getRole() != null && (u.getRole().contains("ADMIN") || u.getRole().contains("OFFICER")))
                    .findFirst()
                    .orElse(null);
        }

        if (user == null) {
            // Fallback to first user in repository
            user = userRepository.findAll().stream().findFirst().orElse(null);
        }

        if (user == null) {
            return "User not found";
        }

        scheme.setSchemeName(scheme.getSchemeName().trim());
        scheme.setDepartment(department);
        scheme.setUser(user);

        if (scheme.getTotalBudget() == null) {
            scheme.setTotalBudget(java.math.BigDecimal.ZERO);
        }
        if (scheme.getBudgetUsed() == null) {
            scheme.setBudgetUsed(java.math.BigDecimal.ZERO);
        }
        if (scheme.getMinGrant() == null) {
            scheme.setMinGrant(java.math.BigDecimal.ZERO);
        }
        if (scheme.getMaxGrant() == null) {
            scheme.setMaxGrant(scheme.getTotalBudget());
        }
        if (scheme.getApplicationStartDate() == null) {
            scheme.setApplicationStartDate(java.time.LocalDate.now());
        }
        if (scheme.getApplicationEndDate() == null) {
            scheme.setApplicationEndDate(java.time.LocalDate.now().plusMonths(3));
        }
        if (scheme.getEligibilityScore() == null) {
            scheme.setEligibilityScore(java.math.BigDecimal.valueOf(50));
        }
        if (scheme.getMinimumScore() == null) {
            scheme.setMinimumScore(50);
        }
        if (scheme.getStatus() == null || scheme.getStatus().isBlank()) {
            scheme.setStatus("ACTIVE");
        }

        schemeRepository.save(scheme);

        return "Scheme created successfully";
    }

    public List<Scheme> getAllSchemes(){
        return schemeRepository.findAll();
    }

    public Scheme getScheme(Integer id){
        return schemeRepository.findById(id).orElse(null);
    }

    public String updateScheme(Integer id,Scheme scheme){

        Scheme existing =
                schemeRepository.findById(id).orElse(null);

        if(existing==null){
            return "Scheme not found";
        }

        existing.setSchemeName(scheme.getSchemeName());
        existing.setDescription(scheme.getDescription());
        existing.setTotalBudget(scheme.getTotalBudget());
        existing.setMinGrant(scheme.getMinGrant());
        existing.setMaxGrant(scheme.getMaxGrant());
        existing.setApplicationStartDate(scheme.getApplicationStartDate());
        existing.setApplicationEndDate(scheme.getApplicationEndDate());
        existing.setEligibilityScore(scheme.getEligibilityScore());
        existing.setStatus(scheme.getStatus());

        schemeRepository.save(existing);

        return "Scheme updated successfully";
    }

    public String deleteScheme(Integer id){

        if(!schemeRepository.existsById(id)){
            return "Scheme not found";
        }

        schemeRepository.deleteById(id);

        return "Scheme deleted successfully";
    }
}
