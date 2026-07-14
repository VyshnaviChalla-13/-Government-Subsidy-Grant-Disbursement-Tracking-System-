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

@Service
public class OfficerService {

    @Autowired
    private OfficerRepository officerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

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

        officer.setUser(user);
        officer.setDepartment(department);

        officerRepository.save(officer);

        return "Officer created successfully";
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
        existing.setDesignation(officer.getDesignation());

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
