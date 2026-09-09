package com.sanket.backend.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sanket.backend.ai.client.AIClient;
import com.sanket.backend.ai.dto.AIReviewAnalysis;
import com.sanket.backend.ai.dto.ReviewResponse;
import com.sanket.backend.ai.entity.Review;
import com.sanket.backend.ai.repository.ReviewRepository;
import com.sanket.backend.github.entity.GitHubRepository;
import com.sanket.backend.github.repository.GitHubRepositoryRepository;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ReviewService {
    private static final int MAX_FILES = 20;
    private static final int MAX_FILE_CHARS = 10_000;
    private static final int MAX_CONTEXT_CHARS = 90_000;

    private final RepositoryCloneService cloneService;
    private final FileScannerService fileScannerService;
    private final GitHubRepositoryRepository repositoryRepository;
    private final AIClient aiClient;
    private final ReviewRepository reviewRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ReviewService(RepositoryCloneService cloneService,
                         FileScannerService fileScannerService,
                         GitHubRepositoryRepository repositoryRepository,
                         AIClient aiClient,
                         ReviewRepository reviewRepository) {
        this.cloneService = cloneService;
        this.fileScannerService = fileScannerService;
        this.repositoryRepository = repositoryRepository;
        this.aiClient = aiClient;
        this.reviewRepository = reviewRepository;
    }

    public void deleteReview(Long id) { reviewRepository.deleteById(id); }
    public void deleteAllHistory() { reviewRepository.deleteAll(); }

    public AIReviewAnalysis runReview(Long repositoryId) throws Exception {
        GitHubRepository repository = repositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new RuntimeException("Repository not found"));

        File folder = cloneService.cloneRepository(repository);
        List<File> files = fileScannerService.scanSourceFiles(folder).stream()
                .sorted(Comparator.comparing(File::getPath))
                .toList();

        StringBuilder context = new StringBuilder();
        context.append("Repository Name: ").append(repository.getName()).append('\n')
                .append("Default Branch: ").append(repository.getDefaultBranch()).append('\n')
                .append("Language: ").append(repository.getLanguage()).append("\n\n");

        int included = 0;
        boolean truncated = false;

        for (File file : files) {
            if (included >= MAX_FILES || context.length() >= MAX_CONTEXT_CHARS) {
                truncated = true;
                break;
            }

            String source;
            try {
                source = Files.readString(file.toPath());
            } catch (Exception unreadable) {
                truncated = true;
                continue;
            }
            if (source.length() > MAX_FILE_CHARS) {
                source = source.substring(0, MAX_FILE_CHARS) + "\n[FILE TRUNCATED]\n";
                truncated = true;
            }

            String relative = folder.toPath().relativize(file.toPath()).toString().replace('\\', '/');
            String block = "\n--- FILE: " + relative + " ---\n" + source + "\n";

            if (context.length() + block.length() > MAX_CONTEXT_CHARS) {
                truncated = true;
                break;
            }

            context.append(block);
            included++;
        }

        AIReviewAnalysis analysis = aiClient.reviewCode(context.toString());
        analysis.setFilesReviewed(included);
        analysis.setTruncated(truncated);

        Review entity = new Review();
        entity.setRepository(repository);
        entity.setFileName(repository.getFullName());
        entity.setReview(objectMapper.writeValueAsString(analysis));
        entity.setScore(analysis.getScore());
        entity.setReviewedAt(LocalDateTime.now());
        reviewRepository.save(entity);

        return analysis;
    }

    public List<ReviewResponse> getHistory(Long repositoryId) {
        return reviewRepository.findByRepositoryId(repositoryId).stream().map(this::toResponse).toList();
    }

    public List<ReviewResponse> getAllHistory() {
        return reviewRepository.findAllByOrderByReviewedAtDesc().stream().map(this::toResponse).toList();
    }

    private ReviewResponse toResponse(Review review) {
        ReviewResponse dto = new ReviewResponse();
        dto.setId(review.getId());
        dto.setFileName(review.getFileName());
        if (review.getRepository() != null) {
            dto.setRepositoryName(review.getRepository().getName());
            dto.setLanguage(review.getRepository().getLanguage());
        }
        dto.setReview(review.getReview());
        dto.setScore(review.getScore());
        dto.setReviewedAt(review.getReviewedAt() == null ? null : review.getReviewedAt().toString());
        return dto;
    }
}
