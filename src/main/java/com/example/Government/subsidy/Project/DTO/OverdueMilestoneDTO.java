package com.example.Government.subsidy.Project.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * One row of GET /reports/overdue - every OVERDUE disbursement stage,
 * with everything an admin needs to act on it without another lookup.
 */
public record OverdueMilestoneDTO(
        Integer applicationMilestoneId,
        Integer applicationId,
        String applicationNumber,
        String beneficiaryName,
        String schemeName,
        String milestoneName,
        BigDecimal amountToRelease,
        LocalDate dueDate,
        long daysOverdue
) {
}
