package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.DTO.OverdueMilestoneDTO;
import com.example.Government.subsidy.Project.Service.DisbursementService;
import com.example.Government.subsidy.Project.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private DisbursementService disbursementService;

    @Autowired
    private ReportService reportService;

    // GET /reports/overdue - beneficiary, scheme, milestone, due date, days overdue
    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN','VERIFICATION_OFFICER','FINANCE_OFFICER')")
    public ResponseEntity<List<OverdueMilestoneDTO>> getOverdueReport() {
        return ResponseEntity.ok(disbursementService.getOverdueReport());
    }

    // GET /reports/scheme-summary/pdf
    @GetMapping("/scheme-summary/pdf")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<byte[]> downloadSchemeSummaryPdf() throws Exception {
        byte[] pdf = reportService.generateSchemeSummaryPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=scheme-summary.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // GET /reports/scheme-summary/excel
    @GetMapping("/scheme-summary/excel")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<byte[]> downloadSchemeSummaryExcel() throws Exception {
        byte[] excel = reportService.generateSchemeSummaryExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=scheme-summary.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}
