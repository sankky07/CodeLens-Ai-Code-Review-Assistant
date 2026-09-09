package com.sanket.backend.auth.handler;

import com.sanket.backend.entity.User;
import com.sanket.backend.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import java.io.IOException;

@Component
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final OAuth2AuthorizedClientService authorizedClientService;
    public OAuthSuccessHandler(
            UserService userService,
            OAuth2AuthorizedClientService authorizedClientService) {

        this.userService = userService;
        this.authorizedClientService = authorizedClientService;

    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User githubUser = (OAuth2User) authentication.getPrincipal();

        var client = authorizedClientService.loadAuthorizedClient(
                "github",
                authentication.getName()
        );

        String accessToken = client.getAccessToken().getTokenValue();

        User user = userService.findOrCreateUser(
                githubUser,
                accessToken
        );

        response.sendRedirect("http://localhost:5173/dashboard");    }
}