package com.example.Government.subsidy.Project.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SchemeRequest {

    private String schemeName;
    private String description;

    private Integer departmentId;
    private Integer userId;

    private Integer minimumScore;


    private BigDecimal totalBudget;
    private BigDecimal minGrant;
    private BigDecimal maxGrant;
    private Double maximumIncome;

    private LocalDate applicationStartDate;
    private LocalDate applicationEndDate;

    private String status;
}