package com.example.Government.subsidy.Project.Controller;


import com.example.Government.subsidy.Project.Entity.SchemeCategory;
import com.example.Government.subsidy.Project.Service.SchemeCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("schemes/scheme-categories")
@CrossOrigin(origins = "*")
public class SchemeCategoryController {

    @Autowired
    private SchemeCategoryService service;

    @PostMapping("/{schemeId}")
    public String addCategory(@PathVariable Integer schemeId,
                              @RequestBody SchemeCategory category) {

        return service.addCategory(schemeId, category);
    }

    @GetMapping("/{schemeId}")
    public List<SchemeCategory> getCategories(@PathVariable Integer schemeId) {

        return service.getCategories(schemeId);
    }
}
