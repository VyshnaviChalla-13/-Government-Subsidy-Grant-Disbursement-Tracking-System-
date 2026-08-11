package com.example.Government.subsidy.Project.DTO;

public record ApprovalPerformanceDTO(
        Integer schemeId,
        String schemeName,
        long approvedCount,
        double averageDaysToApproval
) {
}
