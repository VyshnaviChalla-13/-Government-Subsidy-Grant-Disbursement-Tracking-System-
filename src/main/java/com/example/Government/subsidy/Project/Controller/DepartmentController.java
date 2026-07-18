package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Entity.Department;
import com.example.Government.subsidy.Project.Service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/superadmin/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PostMapping
    public String createDepartment(@RequestBody Department department) {
        return departmentService.createDepartment(department);
    }

    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    @GetMapping("/{id}")
    public Department getDepartment(@PathVariable Integer id) {
        return departmentService.getDepartmentById(id);
    }

    @PutMapping("/{id}")
    public String updateDepartment(@PathVariable Integer id,
                                   @RequestBody Department department) {
        return departmentService.updateDepartment(id, department);
    }

    @DeleteMapping("/{id}")
    public String deleteDepartment(@PathVariable Integer id) {
        return departmentService.deleteDepartment(id);
    }
}
