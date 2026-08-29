package com.example.Government.subsidy.Project.DTO;

import lombok.Data;

@Data
public class UserResponse {

    private Integer userId;
    private String fullName;
    private String mobileNumber;
    private String email;
    private String role;

    /** Populated only on a successful login response. Null for other endpoints. */
    private String token;
}
