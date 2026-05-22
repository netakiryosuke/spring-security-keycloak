package com.netakiryosuke.spring_security_keycloak.domain;

public record User(
    String id,
    String username,
    String email
) {
}
