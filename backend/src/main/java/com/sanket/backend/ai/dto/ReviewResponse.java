package com.sanket.backend.ai.dto;

import lombok.Data;

@Data
public class ReviewResponse {
    private Long id;
    private String fileName;
    private String repositoryName;
    private String language;
    private String review;
    private Integer score;
    private String reviewedAt;
}
