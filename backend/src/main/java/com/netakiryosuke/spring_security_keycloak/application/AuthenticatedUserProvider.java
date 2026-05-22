package com.netakiryosuke.spring_security_keycloak.application;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUserProvider {

    public String getUserId() {
        Jwt jwt = getJwt();
        return jwt.getSubject();
    }

    public boolean hasRole(String role) {
        return getJwt().getClaimAsStringList("realm_access")  != null
            && SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    private Jwt getJwt() {
        Authentication auth =
            SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Jwt jwt)) {
            throw new IllegalStateException("No authenticated user");
        }
        return jwt;
    }
}
