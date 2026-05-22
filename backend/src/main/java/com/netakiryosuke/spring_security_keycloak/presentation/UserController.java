package com.netakiryosuke.spring_security_keycloak.presentation;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.netakiryosuke.spring_security_keycloak.application.UserApplicationService;
import com.netakiryosuke.spring_security_keycloak.domain.User;

@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserApplicationService userApplicationService;

    public UserController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }

    @GetMapping("/me")
    public User getMe() {
        return userApplicationService.lookupMyself();
    }

    @GetMapping
    public List<User> list() {
        return userApplicationService.list();
    }
}
