package com.example.levelcreator.controller;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {

    @RequestMapping("/")
    public String index(){
        return "index.html";
    }

    @RequestMapping("/home")
    public String home(){
        return "home.html";
    }

    @RequestMapping("/login")
    public String login(){
        return "login.html";
    }

    @RequestMapping("/logout-success")
    public String logout(){
        //remove attr
        return "index.html";//logout page
    }

    @RequestMapping("/registration")
    public String registration(){
        return "registration.html";
    }

    @RequestMapping("/following")
    public String following(){
        return "following.html";
    }

    @RequestMapping("/levelcreator")
    public String levelcreator(){
        //if logged in goto home
        if(SecurityContextHolder.getContext().getAuthentication() != null &&
                SecurityContextHolder.getContext().getAuthentication().isAuthenticated() &&
                //when Anonymous Authentication is enabled
                !(SecurityContextHolder.getContext().getAuthentication()
                        instanceof AnonymousAuthenticationToken)){
            return "redirect:/home";
        }
        //else return to index
        return "index.html";
    }



}
