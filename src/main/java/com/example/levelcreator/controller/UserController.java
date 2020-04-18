package com.example.levelcreator.controller;

import com.example.levelcreator.Exception.UserNotFoundException;
import com.example.levelcreator.service.AuthenticationService;
import com.example.levelcreator.service.UserService;
import com.example.levelcreator.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.List;



@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationService authService;

    @GetMapping()
    public List<User> getAllUsers() {
        return userService.getUsers();
    }

    @GetMapping("/profile")
    public String profile(Model model, Authentication authentication){
        User user = authService.getPrincipal(authentication);
        model.addAttribute("user", user);
        return "profile.html";
    }

    @PostMapping("/reset-password")
    public String resetPasswordForm(@RequestParam("password") String password,
                                    @RequestParam("cfmpassword") String confirmpassword,
                                    Model model, Authentication authentication){
        User user = authService.getPrincipal(authentication);
        if(!confirmpassword.equals(password)){
            model.addAttribute("passwordNotMatch", true);
            return "profile.html";
        }
        userService.changePassword(user, password);
        model.addAttribute("passwordChanged", true);
        return "profile.html";
    }



//    public User getUser(@PathVariable int id) {
//        return userService.getUserById(id);
//    }
//
//    public User getUser(@PathVariable String username) {
//        return userService.getUserByUsername(username);
//    }
}