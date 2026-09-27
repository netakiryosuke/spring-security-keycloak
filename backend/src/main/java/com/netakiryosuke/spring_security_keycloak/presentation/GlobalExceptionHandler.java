package com.netakiryosuke.spring_security_keycloak.presentation;

import java.util.NoSuchElementException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ProblemDetail;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({AccessDeniedException.class, AuthorizationDeniedException.class})
    public ProblemDetail handleAccessDeniedException(RuntimeException e) {
        logger.warn("認可エラー", e);
        ProblemDetail problemDetail = ProblemDetail.forStatus(403);
        problemDetail.setTitle("Forbidden");
        problemDetail.setDetail("権限がありません");
        return problemDetail;
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ProblemDetail handleNotFoundException(NoSuchElementException e) {
        logger.warn("ユーザーが見つかりません", e);
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("Not Found");
        problemDetail.setDetail("ユーザーが見つかりません");
        return problemDetail;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(Exception e) {
        logger.error("An error occurred: ", e);
        ProblemDetail problemDetail = ProblemDetail.forStatus(500);
        problemDetail.setTitle("Internal Server Error");
        problemDetail.setDetail(e.getMessage());
        return problemDetail;
    }
}
