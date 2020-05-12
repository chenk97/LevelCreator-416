package com.example.levelcreator.controller;

import com.example.levelcreator.model.Cars;
import com.example.levelcreator.model.Map;
import com.example.levelcreator.model.Project;
import com.example.levelcreator.service.AuthenticationService;
import com.example.levelcreator.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import com.example.levelcreator.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller

public class ProjectController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private ProjectService projectService;

    @RequestMapping("/myWork")
    public String myWork() {
        return "mywork.html";
    }


    //    submitting the form with map preferences directs the user to the workspace page where
//    they are able to start creating
    @RequestMapping("/workspace")
    public String submitNewProject() {
        return "workspace";
    }

    @RequestMapping(value = "/saveMap", method = RequestMethod.POST)
    public @ResponseBody
    void yourMethod(@RequestBody Map newMap) {

    }

    @RequestMapping(value = "/saveProject", method = RequestMethod.POST)
    public @ResponseBody
    void yourMethod(@RequestBody Project newProject) {

    }

}

