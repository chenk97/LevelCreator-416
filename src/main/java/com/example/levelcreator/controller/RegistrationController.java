package com.example.levelcreator.controller;

import com.example.levelcreator.model.User;
import com.example.levelcreator.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class RegistrationController {

    @Autowired
    private UserService userService;

    @GetMapping("/registration")
    public String showForm(Model model) {
        User user = new User();
        model.addAttribute("user", user);
        return "registration.html";
    }

    @PostMapping("/registration")
    public String submit(@ModelAttribute("user") User user, HttpServletRequest request) {
        System.out.println(user);
        if(userService.register(request, user)!=null) {
            return "home.html";
        }else{
            return "registration.html";
        }
    }
}
