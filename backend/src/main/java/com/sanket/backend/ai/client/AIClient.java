package com.sanket.backend.ai.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sanket.backend.ai.config.GeminiConfig;
import com.sanket.backend.ai.dto.AIReviewAnalysis;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class AIClient {

    private final RestTemplate restTemplate;
    private final GeminiConfig geminiConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIClient(RestTemplate restTemplate, GeminiConfig geminiConfig) {
        this.restTemplate = restTemplate;
        this.geminiConfig = geminiConfig;
    }

    public AIReviewAnalysis reviewCode(String code) {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        String prompt = """
                You are a senior software engineer performing a practical code review.

                Review the supplied GitHub repository context.

                IMPORTANT OUTPUT RULES:
                - Return ONLY valid JSON. No Markdown, no code fences, no commentary outside JSON.
                - score must be an integer from 0 to 10.
                - Keep every list concise and actionable. Prefer 3-6 high-value items per section.
                - Do not invent issues. If a category has no meaningful finding, return an empty array.
                - Mention the relevant file name in an issue when the evidence is available.
                - overallSummary must be 2-4 sentences.
                - strengths should contain the strongest positive aspects of the repository.
                - criticalIssues should contain only genuinely critical/high-impact issues.
                - scoreLabel must be one of: Excellent, Very Good, Good, Average, Needs Improvement.

                Return exactly this JSON shape:
                {
                  "overallSummary": "string",
                  "score": 0,
                  "scoreLabel": "Good",
                  "strengths": ["string"],
                  "criticalIssues": ["string"],
                  "bugs": ["string"],
                  "securityIssues": ["string"],
                  "performanceIssues": ["string"],
                  "codeSmells": ["string"],
                  "bestPractices": ["string"],
                  "suggestedImprovements": ["string"]
                }

                Repository context:
                """ + code;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(geminiConfig.getApiKey());

        Map<String, Object> request = Map.of(
                "model", "openai/gpt-oss-120b",
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "temperature", 0.1,
                "max_completion_tokens", 4096,
                "response_format", Map.of("type", "json_object")
        );

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, new HttpEntity<>(request, headers), String.class
            );

            JsonNode content = objectMapper.readTree(response.getBody())
                    .path("choices").path(0).path("message").path("content");

            if (content.isMissingNode() || content.asText().isBlank()) {
                throw new IllegalStateException("Groq returned an empty review response.");
            }

            String jsonText = content.asText().trim();
            AIReviewAnalysis analysis = objectMapper.readValue(jsonText, AIReviewAnalysis.class);
            normalize(analysis);
            return analysis;

        } catch (HttpStatusCodeException e) {
            throw new IllegalStateException("Groq API error " + e.getStatusCode().value() + ": " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to generate a structured AI review: " + e.getMessage(), e);
        }
    }

    private void normalize(AIReviewAnalysis analysis) {
        int score = analysis.getScore() == null ? 0 : analysis.getScore();
        analysis.setScore(Math.max(0, Math.min(10, score)));
        if (analysis.getScoreLabel() == null || analysis.getScoreLabel().isBlank()) {
            analysis.setScoreLabel(labelFor(analysis.getScore()));
        }
    }

    private String labelFor(int score) {
        if (score >= 9) return "Excellent";
        if (score >= 8) return "Very Good";
        if (score >= 7) return "Good";
        if (score >= 5) return "Average";
        return "Needs Improvement";
    }
}
