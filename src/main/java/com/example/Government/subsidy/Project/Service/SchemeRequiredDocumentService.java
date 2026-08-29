package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.Scheme;
import com.example.Government.subsidy.Project.Entity.SchemeRequiredDocument;
import com.example.Government.subsidy.Project.Repository.SchemeRepository;
import com.example.Government.subsidy.Project.Repository.SchemeRequiredDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchemeRequiredDocumentService {

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private SchemeRequiredDocumentRepository repository;

    public SchemeRequiredDocument addRequiredDocument(
            Integer schemeId,
            SchemeRequiredDocument document){

        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));

        document.setScheme(scheme);

        return repository.save(document);
    }

    public List<SchemeRequiredDocument> getRequiredDocuments(Integer schemeId){

        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));

        return repository.findByScheme(scheme);
    }

    public void deleteRequiredDocument(Integer id){
        repository.deleteById(id);
    }

}