package com.example.levelcreator.controller;

import com.example.levelcreator.service.UserService;
import com.example.levelcreator.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;



@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping()
    public List<User> getAllUsers() {
        return userService.getUsers();
    }


//    public User getUser(@PathVariable int id) {
//        return userService.getUserById(id);
//    }
//
//    public User getUser(@PathVariable String username) {
//        return userService.getUserByUsername(username);
//    }
}