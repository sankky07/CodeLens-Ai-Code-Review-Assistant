package com.sanket.backend.github.controller;

import com.sanket.backend.github.entity.GitHubRepository;
import com.sanket.backend.github.service.GitHubService;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/github")
public class GitHubController {

    private final GitHubService gitHubService;

    public GitHubController(GitHubService gitHubService) {
        this.gitHubService = gitHubService;
    }

    @PostMapping("/import")
    public String syncRepositories(Authentication authentication) throws IOException {
        return gitHubService.syncRepositories(getGithubId(authentication));
    }

    @GetMapping("/repositories")
    public List<GitHubRepository> repositories(Authentication authentication) {
        return gitHubService.getRepositories(getGithubId(authentication));
    }

    @GetMapping("/repositories/{id}")
    public GitHubRepository repository(
            @PathVariable Long id,
            Authentication authentication) {
        return gitHubService.getRepository(id, getGithubId(authentication));
    }

    private Long getGithubId(Authentication authentication) {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        return Long.valueOf(oauthUser.getAttribute("id").toString());
    }
}
