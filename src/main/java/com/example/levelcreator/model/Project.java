package com.example.levelcreator.model;

import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.Set;


@Entity
@Table(name = "lc_project")
public class Project {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @NotBlank
    //image stored as base64 byte[] string
    private String screenshot;

    @Column(name = "createdDate")
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date createdDate;


    @Column
    private int likes;

    @ManyToOne
    @JoinColumn(name = "owner", nullable = false)
    private User user;


    @OneToOne
    @JoinColumn(name = "map_id", referencedColumnName = "id")
    private Map map;

    @OneToMany(mappedBy = "Project")
    Set<UserProject> teamProjects;

    public Project(){
        super();
    }

    public Project(String name, @NotBlank String screenshot, Date createdDate, User user, int likes, Map map, Set<UserProject> teamProjects) {
        super();
        this.name = name;
        this.screenshot = screenshot;
        this.createdDate = createdDate;
        this.user = user;
        this.likes = likes;
        this.map = map;
        this.teamProjects = teamProjects;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getScreenshot() {
        return screenshot;
    }

    public void setScreenshot(String screenshot) {
        this.screenshot = screenshot;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public Map getMap() {
        return map;
    }

    public void setMap(Map map) {
        this.map = map;
    }

    public Set<UserProject> getTeamProjects() {
        return teamProjects;
    }

    public void setTeamProjects(Set<UserProject> teamProjects) {
        this.teamProjects = teamProjects;
    }
}
