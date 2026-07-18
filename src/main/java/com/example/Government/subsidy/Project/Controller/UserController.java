package com.example.Government.subsidy.Project.Controller;
import com.example.Government.subsidy.Project.Entity.User;
import com.example.Government.subsidy.Project.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return userService.register(user);
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Integer id) {
        return userService.getUser(id);
    }

    @PutMapping("/update/{id}")
    public String updateUser(@PathVariable Integer id,
                             @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable Integer id) {
        return userService.deleteUser(id);
    }
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return userService.login(user.getMobileNumber(), user.getPassword());
    }
}
