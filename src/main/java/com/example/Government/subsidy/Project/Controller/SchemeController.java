package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Entity.Scheme;
import com.example.Government.subsidy.Project.Service.SchemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departmentadmin/schemes")
@CrossOrigin(origins = "*")
public class SchemeController {

    @Autowired
    private SchemeService schemeService;

    @PostMapping
    public org.springframework.http.ResponseEntity<String> createScheme(@RequestBody Scheme scheme) {
        String result = schemeService.createScheme(scheme);
        if ("Scheme created successfully".equals(result)) {
            return org.springframework.http.ResponseEntity.ok(result);
        }
        return org.springframework.http.ResponseEntity.badRequest().body(result);
    }

    @GetMapping("/all")
    public List<Scheme> getAllSchemes(){
        return schemeService.getAllSchemes();
    }

    @GetMapping("/{id}")
    public Scheme getScheme(@PathVariable Integer id){
        return schemeService.getScheme(id);
    }

    @PutMapping("/{id}")
    public String updateScheme(@PathVariable Integer id,
                               @RequestBody Scheme scheme){
        return schemeService.updateScheme(id,scheme);
    }

    @DeleteMapping("/{id}")
    public String deleteScheme(@PathVariable Integer id){
        return schemeService.deleteScheme(id);
    }
}
