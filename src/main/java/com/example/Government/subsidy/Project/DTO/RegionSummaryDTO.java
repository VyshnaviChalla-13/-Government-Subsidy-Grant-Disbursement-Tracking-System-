package com.example.Government.subsidy.Project.DTO;

/**
 * One row of the region-wise dashboard: aggregated application activity
 * for a single district.
 *
 * potentialGrantValue is the sum of the max grant amount of the scheme
 * applied to, for every APPROVED application in the district. It is a
 * proxy for "funds flowing to this region" until Module 3 (disbursement)
 * records an actual released amount per application/milestone - at that
 * point this field should be swapped for a real disbursed-amount sum.
 */
public record RegionSummaryDTO(
        String district,
        long totalApplications,
        long approvedApplications,
        long rejectedApplications,
        long pendingApplications,
        java.math.BigDecimal potentialGrantValue,
        long totalOfficers,
        /**
         * Always 0 for now - no disbursement/release module exists yet
         * (nothing writes an actual released amount anywhere in the
         * codebase). Wire this to a real sum once that module lands;
         * everything else in this row will keep working unchanged.
         */
        java.math.BigDecimal totalDisbursed
) {
}