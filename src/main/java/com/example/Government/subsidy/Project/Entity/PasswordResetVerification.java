package com.example.Government.subsidy.Project.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String mobileNumber;

    @Column(nullable = false)
    private LocalDateTime verifiedAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;
}