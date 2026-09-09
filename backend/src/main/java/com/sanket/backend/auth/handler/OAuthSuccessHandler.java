package com.sanket.backend.auth.handler;

import com.sanket.backend.entity.User;
import com.sanket.backend.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final OAuth2AuthorizedClientService authorizedClientService;

    private final SecurityContextRepository securityContextRepository =
            new HttpSessionSecurityContextRepository();

    public OAuthSuccessHandler(
            UserService userService,
            OAuth2AuthorizedClientService authorizedClientService) {

        this.userService = userService;
        this.authorizedClientService = authorizedClientService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        // Get authenticated GitHub user
        OAuth2User githubUser =
                (OAuth2User) authentication.getPrincipal();

        // Get GitHub OAuth access token
        var client = authorizedClientService.loadAuthorizedClient(
                "github",
                authentication.getName()
        );

        if (client == null || client.getAccessToken() == null) {
            throw new IllegalStateException(
                    "GitHub OAuth access token was not found"
            );
        }

        String accessToken =
                client.getAccessToken().getTokenValue();

        // Save/update user in database
        User user = userService.findOrCreateUser(
                githubUser,
                accessToken
        );

        // Explicitly save authentication into HTTP session
        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);

        SecurityContextHolder.setContext(context);

        securityContextRepository.saveContext(
                context,
                request,
                response
        );

        // Redirect to production frontend
        response.sendRedirect(
                "https://code-lens-ai-code-review-assistant-three.vercel.app/dashboard"
        );
    }
}
