package com.netakiryosuke.spring_security_keycloak.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.security")
public record SecurityProperties(
    Jwt jwt,
    Cors cors
) {
    public record Jwt(String issuerValidateUri) {}
    public record Cors(List<String> allowedOrigins) {}
}
