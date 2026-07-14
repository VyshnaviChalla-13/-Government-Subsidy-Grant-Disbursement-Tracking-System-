package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.Department;
import com.example.Government.subsidy.Project.Repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public String createDepartment(Department department) {

        if (departmentRepository.existsByDepartmentName(department.getDepartmentName())) {
            return "Department already exists";
        }

        departmentRepository.save(department);

        return "Department created successfully";
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Integer id) {
        return departmentRepository.findById(id).orElse(null);
    }

    public String updateDepartment(Integer id, Department department) {

        Department existing = departmentRepository.findById(id).orElse(null);

        if (existing == null) {
            return "Department not found";
        }

        existing.setDepartmentName(department.getDepartmentName());
        existing.setDescription(department.getDescription());
        existing.setStatus(department.getStatus());

        departmentRepository.save(existing);

        return "Department updated successfully";
    }

    public String deleteDepartment(Integer id) {

        Department department = departmentRepository.findById(id).orElse(null);

        if (department == null) {
            return "Department not found";
        }

        departmentRepository.delete(department);

        return "Department deleted successfully";
    }
}
