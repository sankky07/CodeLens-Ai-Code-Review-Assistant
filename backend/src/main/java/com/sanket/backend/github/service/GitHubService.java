package com.sanket.backend.github.service;

import com.sanket.backend.entity.User;
import com.sanket.backend.github.entity.GitHubRepository;
import com.sanket.backend.github.repository.GitHubRepositoryRepository;
import com.sanket.backend.ai.repository.ReviewRepository;
import com.sanket.backend.repository.UserRepository;
import org.kohsuke.github.GHMyself;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class GitHubService {

    private final GitHubRepositoryRepository repositoryRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public GitHubService(
            GitHubRepositoryRepository repositoryRepository,
            UserRepository userRepository,
            ReviewRepository reviewRepository) {
        this.repositoryRepository = repositoryRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<GitHubRepository> getRepositories(Long githubId) {
        User user = getUser(githubId);
        return repositoryRepository.findAllByUserId(user.getId());
    }

    public GitHubRepository getRepository(Long id, Long githubId) {
        User user = getUser(githubId);
        return repositoryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Repository not found"));
    }

    @Transactional
    public String syncRepositories(Long githubId) throws IOException {
        User user = getUser(githubId);

        GitHub github = new GitHubBuilder()
                .withOAuthToken(user.getAccessToken())
                .build();

        GHMyself me = github.getMyself();
        Set<Long> remoteRepositoryIds = new HashSet<>();

        for (GHRepository repo : me.listRepositories()) {
            remoteRepositoryIds.add(repo.getId());

            GitHubRepository entity = repositoryRepository
                    .findByGithubRepositoryIdAndUserId(repo.getId(), user.getId())
                    .orElse(new GitHubRepository());

            entity.setGithubRepositoryId(repo.getId());
            entity.setName(repo.getName());
            entity.setFullName(repo.getFullName());
            entity.setDescription(repo.getDescription());
            entity.setPrivate(repo.isPrivate());
            entity.setDefaultBranch(repo.getDefaultBranch());
            entity.setLanguage(repo.getLanguage() == null ? "Unknown" : repo.getLanguage());
            entity.setHtmlUrl(repo.getHtmlUrl().toString());
            entity.setUser(user);

            repositoryRepository.save(entity);
        }

        // GitHub is the source of truth. Remove locally cached repositories
        // that are no longer present in the authenticated user's GitHub list.
        List<GitHubRepository> localRepositories = repositoryRepository.findAllByUserId(user.getId());
        int removed = 0;

        for (GitHubRepository local : localRepositories) {
            if (!remoteRepositoryIds.contains(local.getGithubRepositoryId())) {
                reviewRepository.deleteByRepositoryId(local.getId());
                repositoryRepository.delete(local);
                removed++;
            }
        }

        return "Repositories synced successfully. Removed " + removed + " deleted repository(s).";
    }

    private User getUser(Long githubId) {
        return userRepository.findByGithubId(githubId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
