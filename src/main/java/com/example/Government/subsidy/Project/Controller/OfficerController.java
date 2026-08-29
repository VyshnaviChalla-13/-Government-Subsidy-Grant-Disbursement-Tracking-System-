package com.example.Government.subsidy.Project.Controller;
import com.example.Government.subsidy.Project.Entity.Officer;
import com.example.Government.subsidy.Project.Service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/superadmin/officers")
@CrossOrigin(origins = "*")
public class OfficerController {
    @Autowired
    private OfficerService officerService;
    @PostMapping
    public org.springframework.http.ResponseEntity<String> createOfficer(@RequestBody Officer officer) {
        String result = officerService.createOfficer(officer);
        if (result != null && result.startsWith("Officer created successfully")) {
            return org.springframework.http.ResponseEntity.ok(result);
        }
        return org.springframework.http.ResponseEntity.badRequest().body(result);
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
