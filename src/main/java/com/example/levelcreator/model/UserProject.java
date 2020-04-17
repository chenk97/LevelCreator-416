package com.example.levelcreator.model;

import javax.persistence.*;

@Entity
@Table(name = "lc_UserProject")
public class UserProject {

    @Id
    Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @ManyToOne
    @JoinColumn(name = "project_id")
    Project project;

    public UserProject(){
        super();
    }

    public UserProject(Integer id, User user, Project project) {
        super();
        this.id = id;
        this.user = user;
        this.project = project;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
