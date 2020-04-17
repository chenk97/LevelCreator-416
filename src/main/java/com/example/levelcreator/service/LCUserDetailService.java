package com.example.levelcreator.service;

import com.example.levelcreator.model.UserPrincipal;
import com.example.levelcreator.repository.UserRepository;
import com.example.levelcreator.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class LCUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        User user = userRepo.findByEmail(email);
        if (user == null)
            throw new UsernameNotFoundException("User 404");
        else
            return new UserPrincipal(user);
    }
}