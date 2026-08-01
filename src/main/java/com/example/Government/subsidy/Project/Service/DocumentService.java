package com.example.Government.subsidy.Project.Service;


import com.example.Government.subsidy.Project.Entity.Application;
import com.example.Government.subsidy.Project.Entity.Document;
import com.example.Government.subsidy.Project.Repository.ApplicationRepository;
import com.example.Government.subsidy.Project.Repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String uploadDocument(Integer applicationId,
                                 String documentType,
                                 MultipartFile file) throws IOException {

        Application application =
                applicationRepository.findById(applicationId).orElse(null);

        if(application == null){
            return "Application not found";
        }

        File directory = new File(uploadDir);

        if(!directory.exists()){
            directory.mkdirs();
        }

        String fileName =
                UUID.randomUUID()+"_"+file.getOriginalFilename();

        File destination =
                new File(directory,fileName);

        file.transferTo(destination);

        Document document = new Document();

        document.setApplication(application);
        document.setDocumentType(documentType);
        document.setFilePath(destination.getAbsolutePath());
        document.setVerified(false);

        documentRepository.save(document);

        return "Document uploaded successfully";
    }

    public List<Document> getDocuments(Integer applicationId){

        Application application =
                applicationRepository.findById(applicationId).orElse(null);

        if(application==null){
            throw new RuntimeException("Application not found");
        }

        return documentRepository.findByApplication(application);
    }

    public String verifyDocument(Integer documentId,
                                 String remarks,
                                 String officerName){

        Document document =
                documentRepository.findById(documentId).orElse(null);

        if(document==null){
            return "Document not found";
        }

        document.setVerified(true);
        document.setVerificationRemarks(remarks);
        document.setVerifiedAt(LocalDateTime.now());
        document.setVerifiedBy(officerName);

        documentRepository.save(document);

        return "Document verified successfully";
    }

    public String rejectDocument(Integer documentId,
                                 String remarks,
                                 String officerName){

        Document document =
                documentRepository.findById(documentId).orElse(null);

        if(document==null){
            return "Document not found";
        }

        document.setVerified(false);
        document.setVerificationRemarks(remarks);
        document.setVerifiedAt(LocalDateTime.now());
        document.setVerifiedBy(officerName);

        documentRepository.save(document);

        return "Document rejected";
    }

}
