package com.netakiryosuke.spring_security_keycloak.domain;

import java.time.LocalDate;

public record User(
    String id,
    String username,
    String email,
    LocalDate birthDate,
    String residence,
    String occupation,
    String introduction,
    String secretMessage
) {
}
