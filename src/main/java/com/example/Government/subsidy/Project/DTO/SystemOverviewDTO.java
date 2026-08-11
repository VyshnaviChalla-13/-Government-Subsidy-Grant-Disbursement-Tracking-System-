package com.example.Government.subsidy.Project.DTO;

import java.math.BigDecimal;

/**
 * Feeds the four stat cards at the top of the Super Admin dashboard
 * (Departments / Officers / Total Applications / Total Grants).
 *
 * totalGrantValue is the sum of the max grant amount of the scheme applied
 * to, for every VERIFICATION_APPROVED application system-wide - the same
 * proxy used elsewhere until Module 3 (disbursement) tracks an actual
 * released amount.
 */
public record SystemOverviewDTO(
        long totalDepartments,
        long totalOfficers,
        long totalApplications,
        BigDecimal totalGrantValue
) {
}