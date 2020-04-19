package com.example.levelcreator.controller;

import com.example.levelcreator.service.AuthenticationService;
import com.example.levelcreator.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ProjectController {

    private UserService userService;
    private AuthenticationService authenticationService;

    @RequestMapping("/myWork")
    public String myWork(){
        return "mywork.html";
    }

    @RequestMapping("/createProject")
    public String createProject(){
        return "project.html";
    }
//
//    @RequestMapping(value = "/createProject", method = RequestMethod.GET)
//    public String redirect() {
//        return "project.html";
//    }

}
