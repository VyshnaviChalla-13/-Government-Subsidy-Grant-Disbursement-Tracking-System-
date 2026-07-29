package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Entity.SchemeRequiredDocument;
import com.example.Government.subsidy.Project.Service.SchemeRequiredDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("schemes/scheme-required-documents")
@CrossOrigin(origins = "*")
public class SchemeRequiredDocumentController {

    @Autowired
    private SchemeRequiredDocumentService service;

    @PostMapping("/{schemeId}")
    public SchemeRequiredDocument addDocument(
            @PathVariable Integer schemeId,
            @RequestBody SchemeRequiredDocument document){

        return service.addRequiredDocument(schemeId, document);
    }

    @GetMapping("/{schemeId}")
    public List<SchemeRequiredDocument> getDocuments(
            @PathVariable Integer schemeId){

        return service.getRequiredDocuments(schemeId);
    }

    @DeleteMapping("/{id}")
    public String deleteDocument(
            @PathVariable Integer id){

        service.deleteRequiredDocument(id);

        return "Required document deleted successfully";
    }

}