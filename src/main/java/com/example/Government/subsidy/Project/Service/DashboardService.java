package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.DTO.ApprovalPerformanceDTO;
import com.example.Government.subsidy.Project.DTO.RegionSummaryDTO;
import com.example.Government.subsidy.Project.DTO.SchemeSummaryDTO;
import com.example.Government.subsidy.Project.Entity.Application;
import com.example.Government.subsidy.Project.Entity.Officer;
import com.example.Government.subsidy.Project.Entity.Scheme;
import com.example.Government.subsidy.Project.Repository.ApplicationRepository;
import com.example.Government.subsidy.Project.Repository.DepartmentRepository;
import com.example.Government.subsidy.Project.Repository.OfficerRepository;
import com.example.Government.subsidy.Project.Repository.SchemeRepository;
import com.example.Government.subsidy.Project.DTO.SystemOverviewDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private static final String STATUS_REJECTED = "REJECTED";
    private static final String STATUS_APPROVED = "VERIFICATION_APPROVED";

    // Any scheme using 80%+ of its budget is flagged, per the Milestone 3 spec.
    private static final BigDecimal BUDGET_WARNING_THRESHOLD = new BigDecimal("0.80");

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private OfficerRepository officerRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    /**
     * Region-wise summary: application counts and a proxy grant value,
     * grouped by the beneficiary's district.
     */
    public List<RegionSummaryDTO> getRegionSummary() {
        List<Application> applications = applicationRepository.findAll();
        List<Officer> officers = officerRepository.findAll();

        Map<String, List<Application>> appsByDistrict = applications.stream()
                .filter(a -> a.getBeneficiary() != null && a.getBeneficiary().getDistrictId() != null)
                .collect(Collectors.groupingBy(a -> a.getBeneficiary().getDistrictId()));

        Map<String, Long> officersByDistrict = officers.stream()
                .filter(o -> o.getUser() != null && o.getUser().getDistrictId() != null)
                .collect(Collectors.groupingBy(o -> o.getUser().getDistrictId(), Collectors.counting()));

        // Union of both key sets, so a district with officers but no
        // applications yet (or vice versa) still shows up with a 0 for
        // whichever side it's missing, instead of being dropped silently.
        Set<String> allDistricts = new HashSet<>();
        allDistricts.addAll(appsByDistrict.keySet());
        allDistricts.addAll(officersByDistrict.keySet());

        return allDistricts.stream()
                .map(district -> {
                    List<Application> apps = appsByDistrict.getOrDefault(district, List.of());

                    long approved = apps.stream().filter(a -> STATUS_APPROVED.equals(a.getStatus())).count();
                    long rejected = apps.stream().filter(a -> STATUS_REJECTED.equals(a.getStatus())).count();
                    long pending = apps.size() - approved - rejected;

                    BigDecimal potentialGrantValue = apps.stream()
                            .filter(a -> STATUS_APPROVED.equals(a.getStatus()))
                            .map(a -> a.getScheme() != null ? a.getScheme().getMaxGrant() : BigDecimal.ZERO)
                            .filter(java.util.Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    long totalOfficers = officersByDistrict.getOrDefault(district, 0L);

                    return new RegionSummaryDTO(district, apps.size(), approved, rejected, pending, potentialGrantValue, totalOfficers, BigDecimal.ZERO);
                })
                .sorted(Comparator.comparingLong(RegionSummaryDTO::totalApplications).reversed())
                .toList();
    }

    /**
     * Scheme-wise summary: application counts plus budget utilization and
     * an over-80%-used warning flag.
     */
    public List<SchemeSummaryDTO> getSchemeSummary() {
        List<Scheme> schemes = schemeRepository.findAll();
        List<Application> applications = applicationRepository.findAll();

        Map<Integer, List<Application>> bySchemeId = applications.stream()
                .filter(a -> a.getScheme() != null)
                .collect(Collectors.groupingBy(a -> a.getScheme().getSchemeId()));

        return schemes.stream()
                .map(scheme -> {
                    List<Application> apps = bySchemeId.getOrDefault(scheme.getSchemeId(), List.of());

                    long approved = apps.stream().filter(a -> STATUS_APPROVED.equals(a.getStatus())).count();
                    long rejected = apps.stream().filter(a -> STATUS_REJECTED.equals(a.getStatus())).count();

                    BigDecimal totalBudget = scheme.getTotalBudget() != null ? scheme.getTotalBudget() : BigDecimal.ZERO;
                    BigDecimal budgetUsed = scheme.getBudgetUsed() != null ? scheme.getBudgetUsed() : BigDecimal.ZERO;

                    double utilizationPercent = 0.0;
                    boolean warning = false;

                    if (totalBudget.compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal ratio = budgetUsed.divide(totalBudget, 4, RoundingMode.HALF_UP);
                        utilizationPercent = ratio.multiply(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP).doubleValue();
                        warning = ratio.compareTo(BUDGET_WARNING_THRESHOLD) > 0;
                    }

                    return new SchemeSummaryDTO(
                            scheme.getSchemeId(),
                            scheme.getSchemeName(),
                            scheme.getDepartment() != null ? scheme.getDepartment().getDepartmentName() : null,
                            apps.size(),
                            approved,
                            rejected,
                            totalBudget,
                            budgetUsed,
                            utilizationPercent,
                            warning
                    );
                })
                .toList();
    }

    /**
     * Average days from submission to final (VERIFICATION_APPROVED) approval,
     * per scheme. Uses Application.lastUpdated as the approval timestamp
     * since there is no dedicated "approvedAt" column - lastUpdated is
     * touched on every status change, and VERIFICATION_APPROVED is a
     * terminal status, so for approved applications it reflects the moment
     * approval happened.
     */
    public List<ApprovalPerformanceDTO> getApprovalPerformance() {
        List<Application> applications = applicationRepository.findAll();

        Map<Integer, List<Application>> bySchemeId = applications.stream()
                .filter(a -> a.getScheme() != null && STATUS_APPROVED.equals(a.getStatus()))
                .collect(Collectors.groupingBy(a -> a.getScheme().getSchemeId()));

        return bySchemeId.values().stream()
                .filter(apps -> !apps.isEmpty())
                .map(apps -> {
                    Scheme scheme = apps.get(0).getScheme();

                    double avgDays = apps.stream()
                            .filter(a -> a.getSubmittedAt() != null && a.getLastUpdated() != null)
                            .mapToLong(a -> Duration.between(a.getSubmittedAt(), a.getLastUpdated()).toHours())
                            .average()
                            .orElse(0.0) / 24.0;

                    return new ApprovalPerformanceDTO(
                            scheme.getSchemeId(),
                            scheme.getSchemeName(),
                            apps.size(),
                            Math.round(avgDays * 100.0) / 100.0
                    );
                })
                .sorted(Comparator.comparing(ApprovalPerformanceDTO::schemeName))
                .toList();
    }

    /**
     * Feeds the four stat cards at the top of the Super Admin dashboard.
     * totalGrantValue reuses the same "sum of scheme max grant across
     * VERIFICATION_APPROVED applications" proxy used in getRegionSummary().
     */
    public SystemOverviewDTO getSystemOverview() {
        long totalDepartments = departmentRepository.count();
        long totalOfficers = officerRepository.count();

        List<Application> applications = applicationRepository.findAll();
        long totalApplications = applications.size();

        BigDecimal totalGrantValue = applications.stream()
                .filter(a -> STATUS_APPROVED.equals(a.getStatus()))
                .map(a -> a.getScheme() != null ? a.getScheme().getMaxGrant() : BigDecimal.ZERO)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new SystemOverviewDTO(totalDepartments, totalOfficers, totalApplications, totalGrantValue);
    }
}