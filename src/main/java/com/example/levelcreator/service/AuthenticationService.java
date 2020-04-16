package com.example.levelcreator.service;

import com.example.levelcreator.model.User;
import com.example.levelcreator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

public class AuthenticationService {

    @Autowired
    private UserRepository userRepo;

    public User getPrincipal(Authentication authentication){
            return userRepo.findByUsername(authentication.getName());
    }
}
