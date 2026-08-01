package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.Entity.Application;
import com.example.Government.subsidy.Project.Entity.Document;
import com.example.Government.subsidy.Project.Entity.SchemeCategory;
import com.example.Government.subsidy.Project.Entity.SchemeRequiredDocument;
import com.example.Government.subsidy.Project.Repository.DocumentRepository;
import com.example.Government.subsidy.Project.Repository.SchemeCategoryRepository;
import com.example.Government.subsidy.Project.Repository.SchemeRequiredDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EligibilityScoreService {

    @Autowired
    private SchemeCategoryRepository schemeCategoryRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private SchemeRequiredDocumentRepository requiredDocumentRepository;

    /**
     * Income Score
     */
    public int calculateIncomeScore(Application application) {

        Double beneficiaryIncome = application.getBeneficiary().getAnnualIncome();

        if (beneficiaryIncome != null &&
                beneficiaryIncome <= application.getScheme().getMaximumIncome()) {

            return 30;
        }

        return 0;
    }

    /**
     * Category Score
     */
    public int calculateCategoryScore(Application application) {

        List<SchemeCategory> schemeCategories =
                schemeCategoryRepository.findByScheme(application.getScheme());

        String beneficiaryCategory =
                application.getBeneficiary().getCategory();

        for (SchemeCategory schemeCategory : schemeCategories) {

            if (schemeCategory.getCategory()
                    .equalsIgnoreCase(beneficiaryCategory)) {

                return 40;
            }
        }

        return 0;
    }

    /**
     * Required Document Score
     */
    public int calculateDocumentScore(Application application) {

        List<SchemeRequiredDocument> requiredDocuments =
                requiredDocumentRepository.findByScheme(application.getScheme());

        List<Document> uploadedDocuments =
                documentRepository.findByApplication(application);

        int score = 0;

        for (SchemeRequiredDocument required : requiredDocuments) {

            boolean verified = uploadedDocuments.stream()
                    .anyMatch(document ->
                            document.getDocumentType().equalsIgnoreCase(required.getDocumentName())
                                    && Boolean.TRUE.equals(document.getVerified()));

            if (verified) {
                score += required.getPoints();
            }
        }

        return score;
    }

    /**
     * Total Score
     */
    public int calculateTotalScore(Application application) {

        int incomeScore = calculateIncomeScore(application);

        int categoryScore = calculateCategoryScore(application);

        int documentScore = calculateDocumentScore(application);

        return incomeScore + categoryScore + documentScore;
    }

    /**
     * Evaluate Application
     */
    public void evaluateApplication(Application application) {

        int incomeScore = calculateIncomeScore(application);

        int categoryScore = calculateCategoryScore(application);

        int documentScore = calculateDocumentScore(application);

        int totalScore = incomeScore + categoryScore + documentScore;

        application.setEligibilityScore(totalScore);

        if (totalScore >= application.getScheme().getMinimumScore()) {

            application.setEligibilityStatus("ELIGIBLE");

            application.setRejectionReason(null);

            application.setStatus("ELIGIBLE");

        } else {

            application.setEligibilityStatus("INELIGIBLE");

            application.setStatus("REJECTED");

            application.setRejectionReason(
                    "Eligibility score below minimum threshold.");
        }
    }

    /**
     * Print Evaluation (Useful for debugging/logging)
     */
    public String getEvaluationSummary(Application application) {

        int income = calculateIncomeScore(application);

        int category = calculateCategoryScore(application);

        int documents = calculateDocumentScore(application);

        int total = income + category + documents;

        return "Income Score : " + income +
                "\nCategory Score : " + category +
                "\nDocument Score : " + documents +
                "\nTotal Score : " + total +
                "\nEligibility : " +
                (total >= application.getScheme().getMinimumScore()
                        ? "ELIGIBLE"
                        : "INELIGIBLE");
    }
}