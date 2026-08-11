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
        boolean budgetWarning
) {
}
