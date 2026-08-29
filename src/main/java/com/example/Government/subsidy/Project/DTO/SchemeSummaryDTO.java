package com.example.Government.subsidy.Project.DTO;

import java.math.BigDecimal;

public record SchemeSummaryDTO(
        Integer schemeId,
        String schemeName,
        String departmentName,
        long totalApplications,
        long approvedApplications,
        long rejectedApplications,
        BigDecimal totalBudget,
        BigDecimal budgetUsed,
        double utilizationPercent,
        boolean budgetWarning,
        /** % of this scheme's finished disbursement stages (RELEASED or resolved-late COMPLETED)
         *  that were completed on or before their due date, vs. ones that went OVERDUE. */
        double complianceRatePercent,
        long overdueMilestoneCount
) {
}
