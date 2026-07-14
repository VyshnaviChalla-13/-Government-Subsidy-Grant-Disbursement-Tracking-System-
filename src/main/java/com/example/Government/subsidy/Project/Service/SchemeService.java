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

    public String createScheme(Scheme scheme){

        if(schemeRepository.existsBySchemeName(scheme.getSchemeName())){
            return "Scheme already exists";
        }

        Department department =
                departmentRepository.findById(
                                scheme.getDepartment().getDepartmentId())
                        .orElse(null);

        if(department==null){
            return "Department not found";
        }

        User user =
                userRepository.findById(
                                scheme.getUser().getUserId())
                        .orElse(null);

        if(user==null){
            return "User not found";
        }

        scheme.setDepartment(department);
        scheme.setUser(user);

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
