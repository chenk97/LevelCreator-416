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
import com.example.levelcreator.http.Response;

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

    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public User register(HttpServletRequest request, User user) {

        String password = user.getPassword();
        String encrptedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        user.setPassword(encrptedPassword);

        //check username and email uniqueness
        if (userRepo.findByUsername(user.getUsername()) != null ||
                userRepo.findByEmail(user.getEmail()) != null || password.equals("")) {
            //user or email already exist
            return null;
        } else {
            System.out.println("UserService: user validated: " + user);
            userRepo.save(user);
            //auto login
            authWithAuthManager(request, user.getEmail(), password);
            return user;
        }
    }

    private void authWithAuthManager(HttpServletRequest request, String username, String password) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password);
        authToken.setDetails(new WebAuthenticationDetails(request));
        Authentication authentication = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    public Response changePassword(User user, String password) {
        User u = userRepo.findByUsername(user.getUsername());
        u.setPassword(passwordEncoder.encode(password));
        userRepo.save(u);
        return new Response(true);
    }


    public User findUserByUsername(String username){
        return userRepo.findByUsername(username);
    }

    public User findUserByEmail(String email){
        return userRepo.findByEmail(email);
    }



}
