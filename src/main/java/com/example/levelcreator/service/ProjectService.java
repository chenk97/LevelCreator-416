package com.example.levelcreator.service;

import com.example.levelcreator.model.Project;
import com.example.levelcreator.model.User;
import com.example.levelcreator.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;


@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private AuthenticationService authenticationService;


    /***this is probably how you save***/
    public Project saveProjectNew(Project project, Authentication authentication) {
        try {
            User user = authenticationService.getPrincipal(authentication);
            Date date = new Date();
            SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            project.setCreatedDate(ft.format(date));
            project.setUser(user);
            project.setType("false");
            projectRepo.save(project);
            return project;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Project> getProjects() {
        return projectRepo.findAll();
    }

    //    Find a project by id
    public Project getProjectById(int id) {
        return projectRepo.findById(id).get();
    }

    //Updates a project in database
    public Project updateProject(Project project) {
        try {

            Project proj = (Project) projectRepo.findById(project.getId()).get();
            proj.setMapJSON(project.getMapJSON());
            proj.setScreenshot(project.getScreenshot());

            Date date = new Date();
            SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            proj.setCreatedDate(ft.format(date));
            projectRepo.save(proj);
            return proj;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //Get a project base on user
    public List<Project> getProjectByUser(Authentication authentication) {
        User user = authenticationService.getPrincipal(authentication);
        return projectRepo.findByUser(user);
    }

    //Get a project base on user and project name
    public List<Project> getProjectByUserandName(Authentication authentication, String name) {
        User user = authenticationService.getPrincipal(authentication);
        if (StringUtils.isEmpty(name))
            return projectRepo.findByUser(user);
        else
            return projectRepo.findByUserAndNameContaining(user, name);
    }

    //Get project for /home based on type and name of project if there is one.
    public List<Project> getProjectByTypeAndName(String type, String name) {

        if (StringUtils.isEmpty(name))
            return projectRepo.findByType(type);
        else
            return projectRepo.findByTypeAndNameContaining(type, name);

    }

    //Update the type of a project
    public void updateType(int theID) {
        Project theProject = getProjectById(theID);
        if (theProject.getType().equals("false")) {
            theProject.setType("true");
        } else {
            theProject.setType("false");
        }
        projectRepo.save(theProject);
    }

    //Delete  project from database
    public void deleteProject(Integer id) {
        projectRepo.deleteById(id);
    }

    public Set<User> getCollaborators(Project project) {
        Project proj = (Project) projectRepo.findById(project.getId()).get();
        return proj.getCollaborators();
    }

}
