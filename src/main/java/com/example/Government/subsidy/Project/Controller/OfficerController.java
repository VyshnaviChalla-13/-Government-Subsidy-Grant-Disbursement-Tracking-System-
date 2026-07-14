package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Entity.Officer;
import com.example.Government.subsidy.Project.Service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/superadmin/officers")
@CrossOrigin(origins = "*")
public class OfficerController {

    @Autowired
    private OfficerService officerService;

    @PostMapping
    public String createOfficer(@RequestBody Officer officer) {
        return officerService.createOfficer(officer);
    }

    @GetMapping
    public List<Officer> getAllOfficers() {
        return officerService.getAllOfficers();
    }

    @GetMapping("/{id}")
    public Officer getOfficer(@PathVariable Integer id) {
        return officerService.getOfficer(id);
    }

    @PutMapping("/{id}")
    public String updateOfficer(@PathVariable Integer id,
                                @RequestBody Officer officer) {
        return officerService.updateOfficer(id, officer);
    }

    @DeleteMapping("/{id}")
    public String deleteOfficer(@PathVariable Integer id) {
        return officerService.deleteOfficer(id);
    }
}
