package com.sanket.backend.github.repository;

import com.sanket.backend.github.entity.GitHubRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GitHubRepositoryRepository extends JpaRepository<GitHubRepository, Long> {

    Optional<GitHubRepository> findByGithubRepositoryId(Long githubRepositoryId);

    Optional<GitHubRepository> findByGithubRepositoryIdAndUserId(Long githubRepositoryId, Long userId);

    List<GitHubRepository> findAllByUserId(Long userId);

    Optional<GitHubRepository> findByIdAndUserId(Long id, Long userId);
}
