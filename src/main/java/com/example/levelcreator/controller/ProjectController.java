package com.example.levelcreator.controller;

import com.example.levelcreator.model.Card;
import com.example.levelcreator.model.Project;
import com.example.levelcreator.model.User;
import com.example.levelcreator.service.AuthenticationService;
import com.example.levelcreator.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.levelcreator.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@Controller

public class ProjectController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private ProjectService projectService;

//    @RequestMapping("/myWork")
//    public String myWork() {
//        return "mywork.html";
//    }

    @GetMapping("/myWork")
    public ModelAndView showUserProject(Authentication authentication){
        ModelAndView modelAndView = new ModelAndView();
        List<Project> projects = new ArrayList<Project>();
        try{
            projects = projectService.findProjectsByUser(authentication);
//            modelAndView.setViewName("mapResults");
        }catch(Exception e){
            e.printStackTrace();
//            modelAndView.setViewName("error");
        }
        modelAndView.addObject("projects", projects);
        return modelAndView;
    }

    //submitting the form with map preferences directs the user to the workspace page where they are able to start creating
    @RequestMapping("/workspace")
    public String submitNewProject() {
        return "workspace";
    }


    @RequestMapping(value = "/saveProject", method = RequestMethod.POST)
    public @ResponseBody
    void saveProject(@RequestBody Project newProject, Authentication authentication) {
        projectService.saveProjectNew(newProject, authentication);
    }

    @RequestMapping(value = "/updateProject", method = RequestMethod.PUT)
    public @ResponseBody
    void updateProject(@RequestBody Project newProject) {
        projectService.updateProject(newProject);
    }

}

