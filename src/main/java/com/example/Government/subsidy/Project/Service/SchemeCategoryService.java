package com.example.Government.subsidy.Project.Service;


import com.example.Government.subsidy.Project.Entity.Scheme;
import com.example.Government.subsidy.Project.Entity.SchemeCategory;
import com.example.Government.subsidy.Project.Repository.SchemeCategoryRepository;
import com.example.Government.subsidy.Project.Repository.SchemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchemeCategoryService {

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private SchemeCategoryRepository repository;

    public String addCategory(Integer schemeId, SchemeCategory category) {

        Scheme scheme = schemeRepository.findById(schemeId).orElse(null);

        if (scheme == null) {
            return "Scheme not found";
        }

        category.setScheme(scheme);

        repository.save(category);

        return "Category added successfully";
    }

    public List<SchemeCategory> getCategories(Integer schemeId) {

        Scheme scheme = schemeRepository.findById(schemeId).orElse(null);

        if (scheme == null) {
            return List.of();
        }

        return repository.findByScheme(scheme);
    }
}
