package com.example.levelcreator.service;

import com.example.levelcreator.model.Project;
import com.example.levelcreator.model.User;
import com.example.levelcreator.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


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

    public Project getProjectById(int id) {
        return projectRepo.findById(id).get();
    }

    public Project updateProject(Project project) {
        try {

            Project proj = (Project) projectRepo.findById(project.getId()).get();
            proj.setMapJSON(project.getMapJSON());
            proj.setCanvasJSON(project.getCanvasJSON());
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

//    public List<Project> findProjectsByUser(Authentication authentication) {
//        User user = authenticationService.getPrincipal(authentication);
//        List<Project> userProjects = new ArrayList<Project>();
//        List<Project> allProjects = projectRepo.findAll();
//        for (Project proj : allProjects) {
//            if (proj.getUser().equals(user)) {
//                userProjects.add(proj);
//            }
//        }
//        return userProjects;
//    }

    public List<Project> getProjectByUser(Authentication authentication) {
        User user = authenticationService.getPrincipal(authentication);
        return projectRepo.findByUser(user);
    }

    public List<Project> getProjectByType(String type) {
        return projectRepo.findByType(type);
    }

    public void updateType(int theID) {
        Project theProject = getProjectById(theID);
        if (theProject.getType().equals("false")) {
            theProject.setType("true");
        } else {
            theProject.setType("false");
        }
        projectRepo.save(theProject);
    }

    public void deleteProject(Integer id){
        projectRepo.deleteById(id);
    }

}
