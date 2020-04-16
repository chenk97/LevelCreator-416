package com.example.levelcreator.service;

import com.example.levelcreator.repository.UserRepository;
import com.example.levelcreator.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Service
public class UserService{
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    protected AuthenticationManager authenticationManager;


    public List<User> getUsers() {
        return userRepo.findAll();
    }

    public User getUserById(int id) {
        return userRepo.findById(id).get();
    }

    public User getUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    public User register(HttpServletRequest request, User user) {
        String password = user.getPassword();

        String encrptedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

        user.setPassword(encrptedPassword);

        //check username and email uniqueness
        if (userRepo.findByUsername(user.getUsername()) != null ||
                userRepo.findByEmail(user.getEmail()) != null || password.equals("")) {
            return null;
        } else {
            System.out.println("UserService: user validated: " + user);
            userRepo.save(user);
            //auto login
            authWithAuthManager(request, user.getUsername(), password);
            return user;
        }
    }

    public void authWithAuthManager(HttpServletRequest request, String username, String password) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password);
        authToken.setDetails(new WebAuthenticationDetails(request));
        Authentication authentication = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }


    public User findUserByUsername(String username){
        return userRepo.findByUsername(username);
    }

    public User findUserByEmail(String email){
        return userRepo.findByEmail(email);
    }



}
