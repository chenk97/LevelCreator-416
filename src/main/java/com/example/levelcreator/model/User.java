package com.example.levelcreator.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "lc_user")
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

//    @OneToMany(mappedBy="id")
//    private Set<User> followingList;

    @OneToMany(mappedBy = "User")
    Set<UserProject> projectList;

    @OneToMany(mappedBy = "User")
    Set<Comment> commentList;

    public User(){
        super();
    }

    public User(String username, String email, String password,
                Set<UserProject> projectList, Set<Comment> commentList) {
        super();
        this.username = username;
        this.email = email;
        this.password = password;
//        this.followingList = followingList;
        this.projectList = projectList;
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

//    public Set<User> getFollowingList() {
//        return followingList;
//    }
//
//    public void setFollowingList(Set<User> followingList) {
//        this.followingList = followingList;
//    }

    public Set<UserProject> getProjectList() {
        return projectList;
    }

    public void setProjectList(Set<UserProject> projectList) {
        this.projectList = projectList;
    }

}
