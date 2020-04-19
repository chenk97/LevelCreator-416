package com.example.levelcreator.controller;

import com.example.levelcreator.model.Project;
import com.example.levelcreator.service.AuthenticationService;
import org.springframework.ui.Model;
import com.example.levelcreator.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller

public class ProjectController {

    private UserService userService;
    private AuthenticationService authenticationService;

    @RequestMapping("/myWork")
    public String myWork(){
        return "mywork.html";
    }

    //submitting the form with map preferences directs the user to the workspace page where
    //they are able to start creating
    @PostMapping("/workspace")
    public String submitNewProject(@ModelAttribute Project project,Model model) {
        model.addAttribute("project", new Project());
        return "workspace";
    }
}