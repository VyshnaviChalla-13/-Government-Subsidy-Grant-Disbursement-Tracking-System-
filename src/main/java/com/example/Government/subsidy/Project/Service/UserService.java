package com.example.Government.subsidy.Project.Service;


import com.example.Government.subsidy.Project.Entity.User;
import com.example.Government.subsidy.Project.Repository.UserRepository;
import com.example.Government.subsidy.Project.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
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

    public String register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already exists";
        }

        if (userRepository.existsBymobileNumber(user.getMobileNumber())) {
            return "Mobile number already exists";
        }

        if (userRepository.existsByAadhaarNumber(user.getAadhaarNumber())) {
            return "Aadhaar already registered";
        }

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("ROLE_USER");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return "Registration Successful";
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUser(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    public String deleteUser(Integer id) {

        if (!userRepository.existsById(id)) {
            return "User Not Found";
        }

        userRepository.deleteById(id);

        return "User Deleted Successfully";
    }

    public String updateUser(Integer id, User user) {

        User existing = userRepository.findById(id).orElse(null);

        if (existing == null) {
            return "User Not Found";
        }

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
        existing.setAccountHolderName(user.getAccountHolderName());
        existing.setAccountNumber(user.getAccountNumber());
        existing.setIfscCode(user.getIfscCode());

        userRepository.save(existing);

        return "User Updated Successfully";
    }
    public String login(String mobileNumber, String password) {

        User user = userRepository.findBymobileNumber(mobileNumber).orElse(null);

        if (user == null) {
            return "Mobile number not registered";
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return "Invalid Password";
        }

        return jwtUtil.generateToken(user.getMobileNumber(), user.getRole());
    }
}
