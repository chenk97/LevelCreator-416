package com.example.levelcreator.service;

import com.example.levelcreator.model.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;
import java.io.File;

@Service
public class MailService{


    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String mailUserName;

    Logger log = LoggerFactory.getLogger(MailService.class);

    public void sendMail(Email email) {
        long start = System.currentTimeMillis();
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            //true-need to create multipart message
            MimeMessageHelper msgHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            msgHelper.setFrom(mailUserName);
            msgHelper.setSubject(email.getSubject());
            msgHelper.setTo(email.getToAddress().toArray(new String[email.getToAddress().size()]));
            msgHelper.setText(email.getContent(), true);
            log.info("Start sending email...");
            javaMailSender.send(mimeMessage);
            long sendMillTimes = System.currentTimeMillis() - start;
            log.info("Email successfully sent, sendTimes=" + sendMillTimes);
        } catch (Exception e) {
            log.error("error while sending email！", e);
        }
    }

}
