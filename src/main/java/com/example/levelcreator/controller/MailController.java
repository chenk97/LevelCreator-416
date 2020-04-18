package com.example.levelcreator.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.example.levelcreator.model.Email;
import com.example.levelcreator.model.User;
import com.example.levelcreator.service.MailService;
import com.example.levelcreator.service.UserService;


@Controller
public class MailController {

    @Autowired
    private MailService mailService;

    @Autowired
    private UserService userService;

    @GetMapping("/forgotPassword")
    public String showForgetPasswordPage(){
        return "forgot-password";
    }

    @PostMapping("/forgotPassword")
    public String sendEmail(@RequestParam("email") String email, Model model) {
        System.out.println("email:"+email);
        User user = userService.getUserByEmail(email);
        if(user == null){
            model.addAttribute("invalidemail", true);
            return "forgot-password";
        }
        Email emailMsg = new Email();
        //generate temporary email
        Random random = new Random();
        String result="";
        for (int i = 0; i < 6; i ++)
        {
            result += random.nextInt(10);
        }
        System.out.println("**********TEMPORARY PASSWORD**********:" + result);
        userService.changePassword(user, result);
        List<String> emailList = new ArrayList<String>();
        emailList.add(email);
        emailMsg.setToAddress(emailList);
        emailMsg.setSubject("RE : FORGOT PASSWORD");//email subject
        emailMsg.setContent("Hi, this is LevelCreator team." +
                "<br>Your TEMPORARY PASSWORD is: " + result +
                "<br>Please login with this password and reset your password at personal profile page." +
                "<br>BE AWARE if you have never requested password reset and receive this email.");
        // send email
        mailService.sendMail(emailMsg);
        model.addAttribute("emailsent",true);
        return "forgot-password";
    }
}
