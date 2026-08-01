package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.DTO.DocumentVerificationRequest;
import com.example.Government.subsidy.Project.Entity.Document;
import com.example.Government.subsidy.Project.Service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public String uploadDocument(
            @RequestParam Integer applicationId,
            @RequestParam String documentType,
            @RequestParam MultipartFile file) throws IOException {

        return documentService.uploadDocument(
                applicationId,
                documentType,
                file
        );
    }

    @GetMapping("/application/{applicationId}")
    public List<Document> getDocuments(
            @PathVariable Integer applicationId){

        return documentService.getDocuments(applicationId);
    }

    @PatchMapping("/{documentId}/verify")
    public String verifyDocument(
            @PathVariable Integer documentId,
            @RequestBody DocumentVerificationRequest request) {

        return documentService.verifyDocument(
                documentId,
                request.getRemarks(),
                request.getOfficer());
    }

    @PatchMapping("/{documentId}/reject")
    public String rejectDocument(
            @PathVariable Integer documentId,
            @RequestBody DocumentVerificationRequest request) {

        return documentService.rejectDocument(
                documentId,
                request.getRemarks(),
                request.getOfficer());
    }

}
