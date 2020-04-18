package com.example.levelcreator.model;

import java.io.File;
import java.util.List;


public class Email {


//    private String fromAddress;


    private List<String> toAddress;


    private List<String> ccAddress;

    private List<String> bccAddress;


    private String subject;


    private String content;


    private List<File> attachments;


    public List<String> getToAddress() {

        return toAddress;
    }

    public void setToAddress(List<String> toAddress) {

        this.toAddress = toAddress;
    }

    public List<String> getCcAddress() {

        return ccAddress;
    }

    public void setCcAddress(List<String> ccAddress) {

        this.ccAddress = ccAddress;
    }

    public List<String> getBccAddress() {

        return bccAddress;
    }

    public void setBccAddress(List<String> bccAddress) {

        this.bccAddress = bccAddress;
    }

    public String getSubject() {

        return subject;
    }

    public void setSubject(String subject) {

        this.subject = subject;
    }

    public String getContent() {

        return content;
    }

    public void setContent(String content) {

        this.content = content;
    }

    public List<File> getAttachments() {

        return attachments;
    }

    public void setAttachments(List<File> attachments) {

        this.attachments = attachments;
    }

}