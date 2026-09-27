package com.netakiryosuke.spring_security_keycloak.presentation;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

public class AccessLoggingFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(AccessLoggingFilter.class);
    private static final String ANONYMOUS_USER = "anonymous";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        long startedAt = System.nanoTime();
        boolean completed = false;
        try {
            filterChain.doFilter(request, response);
            completed = true;
        } finally {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            String user = ANONYMOUS_USER;
            if (authentication instanceof JwtAuthenticationToken jwt && jwt.isAuthenticated()) {
                String email = jwt.getToken().getClaimAsString("email");
                user = email == null || email.isBlank() ? jwt.getName() : email;
            }
            logger.info("method={} path={} status={} durationMs={} user={}",
                    singleLine(request.getMethod()), singleLine(request.getRequestURI()),
                    completed ? response.getStatus() : HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startedAt), singleLine(user));
        }
    }

    private static String singleLine(String value) {
        return value.replace('\r', '_').replace('\n', '_');
    }
}
