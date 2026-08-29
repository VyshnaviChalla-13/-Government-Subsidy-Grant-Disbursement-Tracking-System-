package com.example.Government.subsidy.Project.Security;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioConfig {

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @PostConstruct
    public void initTwilio() {
        if (accountSid != null && !accountSid.isBlank() && authToken != null && !authToken.isBlank()) {
            try {
                Twilio.init(accountSid, authToken);
                System.out.println("Twilio initialized successfully.");
            } catch (Exception e) {
                System.err.println("Twilio initialization skipped: " + e.getMessage());
            }
        } else {
            System.out.println("Twilio credentials not provided. Twilio integration is disabled in local dev mode.");
        }
    }
}