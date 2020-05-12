package com.example.levelcreator.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "user")
public class User {

    @Id
    @Column(name = "id", unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

//    @Lob
//    @NotBlank
//    //image stored as base64 byte[] string
//    private String avatar;

    @ManyToMany
    @JoinTable(
            name = "user_project",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "project_id"))
    Set<Project> projectList;

    @ManyToMany
    @JoinTable(
            name = "user_follow",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follow_id"))
    Set<User> follows;

    @ManyToMany(mappedBy="follows")
    Set<User> followers;

    @OneToMany(mappedBy = "user")
    Set<Comment> commentList;

    public User(){
        super();
    }

    public User(Integer id, String username, String email, String password,
                Set<Project> projectList, Set<User> follows, Set<User> followers, Set<Comment> commentList) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.projectList = projectList;
        this.follows = follows;
        this.followers = followers;
        this.commentList = commentList;
    }

    public Integer getId(){
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public String getUsername(){
        return username;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public Set<Comment> getCommentList() {
        return commentList;
    }

    public void setCommentList(Set<Comment> commentList) {
        this.commentList = commentList;
    }

    public String getPassword(){
        return password;
    }

    public void setPassword(String password){
        this.password = password;
    }

//    public String getAvatar() {
//        return avatar;
//    }
//
//    public void setAvatar(String avatar) {
//        this.avatar = avatar;
//    }


    public Set<User> getFollows() {
        return follows;
    }

    public void setFollows(Set<User> follows) {
        this.follows = follows;
    }

    public Set<User> getFollowers() {
        return followers;
    }

    public void setFollowers(Set<User> followers) {
        this.followers = followers;
    }

    public Set<Project> getProjectList() {
        return projectList;
    }

    public void setProjectList(Set<Project> projectList) {
        this.projectList = projectList;
    }

}
