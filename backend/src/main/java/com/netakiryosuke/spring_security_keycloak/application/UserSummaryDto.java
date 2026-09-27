package com.netakiryosuke.spring_security_keycloak.application;

import java.time.LocalDate;

public record UserSummaryDto(
    String id,
    String username,
    String email,
    LocalDate birthDate
) {
}
