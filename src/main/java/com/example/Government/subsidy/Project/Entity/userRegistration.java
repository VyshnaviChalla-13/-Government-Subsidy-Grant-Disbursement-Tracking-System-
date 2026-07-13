package com.example.Government.subsidy.Project.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@Entity
@NoArgsConstructor
@Table(name="users")
public class userRegistration {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer userId;

        @Column(nullable = false)
        private String fullName;

        @Column(nullable = false, unique = true)
        private String email;

        @Column(nullable = false, unique = true)
        private String mobileNumber;

        @Column(nullable = false)
        private String password;

        @Column(nullable = false, unique = true, length = 12)
        private String aadhaarNumber;

        @Column(nullable = false)
        private LocalDate dateOfBirth;

        @Column(nullable = false)
        private String gender;

        @Column(nullable = false)
        private String address;

        @Column(nullable = false)
        private String districtId;

        @Column(nullable = false)
        private String stateId;

        @Column(nullable = false)
        private String talukaId;

        @Column(nullable = false)
        private String villageId;

        @Column(nullable = false)
        private String pincode;

        @Column(nullable = false)
        private String occupation;

        @Column(nullable = false)
        private String disabilityStatus;

        @Column(nullable = false)
        private String maritalStatus;

        @Column(nullable = false)
        private Double annualIncome;

        @Column(nullable = false)
        private String category;

        @Column(nullable = false)
        private String bankName;

        @Column(nullable = false)
        private String accountHolderName;

        @Column(nullable = false, unique = true)
        private String accountNumber;

        @Column(nullable = false)
        private String ifscCode;

        private String role = "BENEFICIARY";


        private String status = "PENDING";

        @Column(nullable = false, updatable = false)
        private LocalDateTime createdAt;

        @PrePersist
        public void prePersist() {

                if (status == null) {
                        status = "PENDING";
                }

                if (role == null) {
                        role = "BENEFICIARY";
                }

                createdAt = LocalDateTime.now();
        }


}

