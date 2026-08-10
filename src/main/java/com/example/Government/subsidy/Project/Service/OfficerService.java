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
            "FIELD_OFFICER", "DISTRICT_OFFICER", "FINANCE_OFFICER", "DEPT_ADMIN"
    );

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

        user.setRole(designation.toUpperCase());
        userRepository.save(user);

        officer.setUser(user);
        officer.setDepartment(department);
        officer.setDesignation(designation.toUpperCase());
        officerRepository.save(officer);
        return "Officer created successfully with role " + designation.toUpperCase();
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
            existing.setDesignation(designation);
            User user = existing.getUser();
            if (user != null) {
                user.setRole(designation);
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
