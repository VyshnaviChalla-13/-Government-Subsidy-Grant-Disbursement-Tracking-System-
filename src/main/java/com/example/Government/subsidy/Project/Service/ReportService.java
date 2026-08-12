package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.DTO.SchemeSummaryDTO;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * Task 3 - downloadable scheme-summary reports.
 * PDF via OpenPDF, Excel via Apache POI - see pom.xml for the two new
 * dependencies this needed.
 */
@Service
public class ReportService {

    @Autowired
    private DashboardService dashboardService;

    public byte[] generateSchemeSummaryPdf() throws DocumentException {
        List<SchemeSummaryDTO> schemes = dashboardService.getSchemeSummary();

        Document document = new Document(PageSize.A4.rotate(), 24, 24, 30, 24);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
        Paragraph title = new Paragraph("Scheme-wise Fund Utilization Summary", titleFont);
        title.setSpacingAfter(14);
        document.add(title);

        String[] headers = {
                "Scheme", "Department", "Applications", "Approved", "Total Budget",
                "Budget Used", "Utilization %", "Warning", "Compliance %", "Overdue Stages"
        };

        PdfPTable table = new PdfPTable(headers.length);
        table.setWidthPercentage(100);

        Font headerFont = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(new Color(30, 64, 122));
            cell.setPadding(6);
            table.addCell(cell);
        }

        Font cellFont = new Font(Font.HELVETICA, 9);
        for (SchemeSummaryDTO s : schemes) {
            table.addCell(new Phrase(nullSafe(s.schemeName()), cellFont));
            table.addCell(new Phrase(nullSafe(s.departmentName()), cellFont));
            table.addCell(new Phrase(String.valueOf(s.totalApplications()), cellFont));
            table.addCell(new Phrase(String.valueOf(s.approvedApplications()), cellFont));
            table.addCell(new Phrase(String.valueOf(s.totalBudget()), cellFont));
            table.addCell(new Phrase(String.valueOf(s.budgetUsed()), cellFont));
            table.addCell(new Phrase(String.format("%.2f", s.utilizationPercent()), cellFont));
            table.addCell(new Phrase(s.budgetWarning() ? "YES" : "-", cellFont));
            table.addCell(new Phrase(String.format("%.2f", s.complianceRatePercent()), cellFont));
            table.addCell(new Phrase(String.valueOf(s.overdueMilestoneCount()), cellFont));
        }

        if (schemes.isEmpty()) {
            document.add(new Paragraph("No schemes to report on yet.", cellFont));
        } else {
            document.add(table);
        }

        document.close();
        return out.toByteArray();
    }

    public byte[] generateSchemeSummaryExcel() throws IOException {
        List<SchemeSummaryDTO> schemes = dashboardService.getSchemeSummary();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Scheme Summary");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            String[] headers = {
                    "Scheme ID", "Scheme Name", "Department", "Total Applications",
                    "Approved", "Rejected", "Total Budget", "Budget Used", "Utilization %",
                    "Budget Warning", "Compliance %", "Overdue Milestones"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (SchemeSummaryDTO s : schemes) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(s.schemeId() != null ? s.schemeId() : 0);
                row.createCell(1).setCellValue(nullSafe(s.schemeName()));
                row.createCell(2).setCellValue(nullSafe(s.departmentName()));
                row.createCell(3).setCellValue(s.totalApplications());
                row.createCell(4).setCellValue(s.approvedApplications());
                row.createCell(5).setCellValue(s.rejectedApplications());
                row.createCell(6).setCellValue(s.totalBudget() != null ? s.totalBudget().doubleValue() : 0);
                row.createCell(7).setCellValue(s.budgetUsed() != null ? s.budgetUsed().doubleValue() : 0);
                row.createCell(8).setCellValue(s.utilizationPercent());
                row.createCell(9).setCellValue(s.budgetWarning() ? "YES" : "NO");
                row.createCell(10).setCellValue(s.complianceRatePercent());
                row.createCell(11).setCellValue(s.overdueMilestoneCount());
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private String nullSafe(String s) {
        return s != null ? s : "";
    }
}
