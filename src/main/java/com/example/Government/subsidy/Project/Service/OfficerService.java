package com.example.Government.subsidy.Project.Service;
import com.example.Government.subsidy.Project.Entity.Department;
import com.example.Government.subsidy.Project.Entity.User;
import com.example.Government.subsidy.Project.Entity.Officer;
import com.example.Government.subsidy.Project.Repository.DepartmentRepository;
import com.example.Government.subsidy.Project.Repository.OfficerRepository;
import com.example.Government.subsidy.Project.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;

@Service
public class OfficerService {
    @Autowired
    private OfficerRepository officerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DepartmentRepository departmentRepository;

    private static final Set<String> VALID_ROLES = Set.of(
            "FRONT_DESK_OFFICER", "VERIFICATION_OFFICER", "FINANCE_OFFICER", "DEPT_ADMIN",
            "ROLE_FRONT_DESK_OFFICER", "ROLE_VERIFICATION_OFFICER", "ROLE_FINANCE_OFFICER", "ROLE_DEPT_ADMIN",
            "FIELD_OFFICER", "DISTRICT_OFFICER"
    );

    private String canonicalRole(String role) {
        if (role == null) return null;
        String upper = role.toUpperCase();
        if (upper.startsWith("ROLE_")) {
            upper = upper.substring(5);
        }
        if ("FIELD_OFFICER".equals(upper)) {
            return "FRONT_DESK_OFFICER";
        }
        if ("DISTRICT_OFFICER".equals(upper)) {
            return "VERIFICATION_OFFICER";
        }
        return upper;
    }

    public String createOfficer(Officer officer) {
        if (officerRepository.existsByEmployeeCode(officer.getEmployeeCode())) {
            return "Employee Code already exists";
        }
        User user = userRepository.findById(
                officer.getUser().getUserId()).orElse(null);
        if (user == null) {
            return "User not found";
        }
        Department department = departmentRepository.findById(
                officer.getDepartment().getDepartmentId()).orElse(null);
        if (department == null) {
            return "Department not found";
        }

        String designation = officer.getDesignation();
        if (designation == null || !VALID_ROLES.contains(designation.toUpperCase())) {
            return "Invalid designation. Must be one of: " + VALID_ROLES;
        }

        String canonical = canonicalRole(designation);
        user.setRole("ROLE_" + canonical);
        userRepository.save(user);

        officer.setUser(user);
        officer.setDepartment(department);
        officer.setDesignation(canonical);
        officerRepository.save(officer);
        return "Officer created successfully with role ROLE_" + canonical;
    }

    public List<Officer> getAllOfficers() {
        return officerRepository.findAll();
    }
    public Officer getOfficer(Integer id) {
        return officerRepository.findById(id).orElse(null);
    }
    public String updateOfficer(Integer id, Officer officer) {
        Officer existing = officerRepository.findById(id).orElse(null);
        if (existing == null) {
            return "Officer not found";
        }
        existing.setEmployeeCode(officer.getEmployeeCode());

        if (officer.getDesignation() != null) {
            String designation = officer.getDesignation().toUpperCase();
            if (!VALID_ROLES.contains(designation)) {
                return "Invalid designation. Must be one of: " + VALID_ROLES;
            }
            String canonical = canonicalRole(designation);
            existing.setDesignation(canonical);
            User user = existing.getUser();
            if (user != null) {
                user.setRole("ROLE_" + canonical);
                userRepository.save(user);
            }
        }

        Department department =
                departmentRepository.findById(
                        officer.getDepartment().getDepartmentId()).orElse(null);
        if (department != null) {
            existing.setDepartment(department);
        }
        officerRepository.save(existing);
        return "Officer updated successfully";
    }
    public String deleteOfficer(Integer id) {
        if (!officerRepository.existsById(id)) {
            return "Officer not found";
        }
        officerRepository.deleteById(id);
        return "Officer deleted successfully";
    }
}
