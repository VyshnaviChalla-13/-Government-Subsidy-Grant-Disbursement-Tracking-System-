package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.DTO.ApprovalPerformanceDTO;
import com.example.Government.subsidy.Project.DTO.RegionSummaryDTO;
import com.example.Government.subsidy.Project.DTO.SchemeSummaryDTO;
import com.example.Government.subsidy.Project.DTO.SystemOverviewDTO;
import com.example.Government.subsidy.Project.Service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/regions")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN','VERIFICATION_OFFICER')")
    public List<RegionSummaryDTO> getRegionSummary() {
        return dashboardService.getRegionSummary();
    }

    @GetMapping("/schemes")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN','FINANCE_OFFICER')")
    public List<SchemeSummaryDTO> getSchemeSummary() {
        return dashboardService.getSchemeSummary();
    }

    @GetMapping("/performance")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN')")
    public List<ApprovalPerformanceDTO> getApprovalPerformance() {
        return dashboardService.getApprovalPerformance();
    }

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN','FINANCE_OFFICER')")
    public SystemOverviewDTO getSystemOverview() {
        return dashboardService.getSystemOverview();
    }
}