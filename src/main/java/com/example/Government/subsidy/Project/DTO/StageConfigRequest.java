package com.example.Government.subsidy.Project.DTO;

import lombok.Data;

import java.math.BigDecimal;

/**
 * One stage inside a POST /disbursement/plan/{schemeId}/configure request body.
 * Example JSON:
 * {
 *   "milestoneOrder": 1,
 *   "milestoneName": "Initial Documentation Submitted",
 *   "description": "Beneficiary uploads all mandatory documents",
 *   "amount": 20000,
 *   "dueAfterDays": 7
 * }
 */
@Data
public class StageConfigRequest {
    private Integer milestoneOrder;
    private String milestoneName;
    private String description;
    private BigDecimal amount;
    private Integer dueAfterDays;
}
