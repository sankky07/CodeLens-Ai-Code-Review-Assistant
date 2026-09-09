package com.sanket.backend.ai.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class AIReviewAnalysis {
    private String overallSummary = "";
    private Integer score = 0;
    private String scoreLabel = "Needs Improvement";
    private List<String> strengths = new ArrayList<>();
    private List<String> criticalIssues = new ArrayList<>();
    private List<String> bugs = new ArrayList<>();
    private List<String> securityIssues = new ArrayList<>();
    private List<String> performanceIssues = new ArrayList<>();
    private List<String> codeSmells = new ArrayList<>();
    private List<String> bestPractices = new ArrayList<>();
    private List<String> suggestedImprovements = new ArrayList<>();
    private Integer filesReviewed = 0;
    private Boolean truncated = false;
}
