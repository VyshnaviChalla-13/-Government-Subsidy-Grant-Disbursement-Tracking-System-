package com.example.Government.subsidy.Project.Exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown by service methods when a request violates a business rule
 * (e.g. "stage amounts don't sum to the approved grant", "an earlier
 * stage is overdue"). Caught by GlobalExceptionHandler and converted
 * into a proper HTTP status + JSON body, instead of the old pattern of
 * always returning 200 with a plain-text message.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public static ApiException badRequest(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, message);
    }

    public static ApiException notFound(String message) {
        return new ApiException(HttpStatus.NOT_FOUND, message);
    }

    public HttpStatus getStatus() {
        return status;
    }
}
