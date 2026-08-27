package com.example.Government.subsidy.Project.Service;

import com.example.Government.subsidy.Project.DTO.UserResponse;
import com.example.Government.subsidy.Project.Entity.User;
import com.example.Government.subsidy.Project.Repository.UserRepository;
import com.example.Government.subsidy.Project.Security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private NotificationService notificationService;


    // =========================================================
    // REGISTER BENEFICIARY
    // =========================================================

    public ResponseEntity<String> register(User user) {

        // Check email
        if (userRepository.existsByEmail(user.getEmail())) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }


        // Check mobile number
        if (userRepository.existsBymobileNumber(user.getMobileNumber())) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Mobile number already exists");
        }


        // Check Aadhaar
        if (userRepository.existsByAadhaarNumber(user.getAadhaarNumber())) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Aadhaar already registered");
        }


        /*
         * IMPORTANT:
         *
         * Do not trust role coming from frontend.
         * Every user registering through this endpoint
         * will be a beneficiary.
         */

        user.setRole("ROLE_BENEFICIARY");


        // Encode password before saving
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );


        // Save user
        User savedUser = userRepository.save(user);


        // =====================================================
        // AUDIT LOG
        // =====================================================

        auditLogService.log(
                savedUser.getUserId(),
                savedUser.getFullName(),
                "REGISTERED",
                "USER_ACCOUNT",
                "New beneficiary account created"
        );


        // =====================================================
        // APP NOTIFICATION
        // =====================================================

        notificationService.createNotification(
                savedUser.getUserId(),
                "Registration Successful",
                "Your beneficiary registration was completed successfully.",
                "REGISTRATION",
                null
        );


        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Registration Successful");
    }


    // =========================================================
    // GET ALL USERS
    // =========================================================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================================================
    // GET USER BY ID
    // =========================================================

    public User getUser(Integer id) {

        return userRepository.findById(id)
                .orElse(null);
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    public ResponseEntity<String> deleteUser(Integer id) {

        User user = userRepository.findById(id)
                .orElse(null);

        if (user == null) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User Not Found");
        }


        /*
         * Store target user's information before deletion.
         */

        Integer targetUserId = user.getUserId();

        String targetUserName = user.getFullName();


        // Get currently logged-in user
        User performedBy = getAuthenticatedUser();


        // Delete user
        userRepository.delete(user);


        // =====================================================
        // AUDIT LOG
        // =====================================================

        if (performedBy != null) {

            auditLogService.log(
                    performedBy.getUserId(),
                    performedBy.getFullName(),
                    "DELETED_USER",
                    "USER_ACCOUNT",
                    "User account deleted: " + targetUserName
            );

        } else {

            auditLogService.log(
                    null,
                    "SYSTEM",
                    "DELETED_USER",
                    "USER_ACCOUNT",
                    "User account deleted: " + targetUserName
            );
        }


        return ResponseEntity.ok("User Deleted Successfully");
    }


    // =========================================================
    // UPDATE USER
    // =========================================================

    public ResponseEntity<String> updateUser(Integer id, User user) {

        User existing = userRepository.findById(id)
                .orElse(null);

        if (existing == null) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User Not Found");
        }


        // =====================================================
        // UPDATE ALLOWED FIELDS
        // =====================================================

        existing.setFullName(user.getFullName());

        existing.setEmail(user.getEmail());

        existing.setMobileNumber(user.getMobileNumber());

        existing.setAddress(user.getAddress());

        existing.setDistrictId(user.getDistrictId());

        existing.setStateId(user.getStateId());

        existing.setPincode(user.getPincode());

        existing.setOccupation(user.getOccupation());

        existing.setAnnualIncome(user.getAnnualIncome());

        existing.setCategory(user.getCategory());

        existing.setBankName(user.getBankName());

        existing.setAccountHolderName(
                user.getAccountHolderName()
        );

        existing.setAccountNumber(
                user.getAccountNumber()
        );

        existing.setIfscCode(
                user.getIfscCode()
        );


        // Save updated user
        User updatedUser =
                userRepository.save(existing);


        // Get person who performed the update
        User performedBy =
                getAuthenticatedUser();


        // =====================================================
        // AUDIT LOG
        // =====================================================

        if (performedBy != null) {

            auditLogService.log(
                    performedBy.getUserId(),
                    performedBy.getFullName(),
                    "UPDATED_PROFILE",
                    "USER_ACCOUNT",
                    "Beneficiary profile updated: "
                            + updatedUser.getFullName()
            );

        } else {

            auditLogService.log(
                    null,
                    "SYSTEM",
                    "UPDATED_PROFILE",
                    "USER_ACCOUNT",
                    "Beneficiary profile updated: "
                            + updatedUser.getFullName()
            );
        }


        return ResponseEntity.ok("User Updated Successfully");
    }


    // =========================================================
    // LOGIN
    // =========================================================

    public ResponseEntity<UserResponse> login(
            String mobileNumber,
            String password
    ) {

        User user =
                userRepository
                        .findBymobileNumber(mobileNumber)
                        .orElse(null);


        // =====================================================
        // MOBILE NUMBER NOT REGISTERED
        // =====================================================

        if (user == null) {

            auditLogService.log(
                    null,
                    "Unknown User",
                    "LOGIN_FAILED",
                    "USER_ACCOUNT",
                    "Login failed - mobile number not registered"
            );

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .build();
        }


        // =====================================================
        // INVALID PASSWORD
        // =====================================================

        if (!passwordEncoder.matches(
                password,
                user.getPassword()
        )) {

            auditLogService.log(
                    user.getUserId(),
                    user.getFullName(),
                    "LOGIN_FAILED",
                    "USER_ACCOUNT",
                    "Login failed - invalid password"
            );

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .build();
        }


        // =====================================================
        // GENERATE JWT  (now embeds userId as a claim)
        // =====================================================

        String token =
                jwtUtil.generateToken(
                        user.getMobileNumber(),
                        user.getRole(),
                        user.getUserId()
                );


        // =====================================================
        // SUCCESSFUL LOGIN AUDIT
        // =====================================================

        auditLogService.log(
                user.getUserId(),
                user.getFullName(),
                "LOGGED_IN",
                "USER_ACCOUNT",
                "Successful login"
        );


        // =====================================================
        // BUILD AND RETURN RESPONSE
        // =====================================================

        UserResponse response = new UserResponse();
        response.setToken(token);
        response.setUserId(user.getUserId());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());
        response.setMobileNumber(user.getMobileNumber());
        response.setEmail(user.getEmail());

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // GET CURRENTLY AUTHENTICATED USER
    // =========================================================

    private User getAuthenticatedUser() {

        try {

            Authentication authentication =
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication();


            // No authentication
            if (authentication == null) {

                return null;
            }


            // Authentication not available
            if (!authentication.isAuthenticated()) {

                return null;
            }


            /*
             * Your JWT is generated using:
             *
             * user.getMobileNumber()
             *
             * Therefore authentication.getName()
             * should contain the mobile number.
             */

            String mobileNumber =
                    authentication.getName();


            if (mobileNumber == null ||
                    mobileNumber.isBlank()) {

                return null;
            }


            return userRepository
                    .findBymobileNumber(mobileNumber)
                    .orElse(null);

        } catch (Exception e) {

            return null;
        }
    }
}