package com.smhrd.controller;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // Gmail 정보
    private final String gmailUsername = "cksdud010501@gmail.com";
    private final String gmailPassword = "yogserfqiwoadszn"; // 앱 비밀번호

    // Naver 정보 (앱 비밀번호 사용)
    private final String naverUsername = "cksdud99086@naver.com";
    private final String naverPassword = "G3VV19HZ1148"; // 앱 비밀번호

    public void sendMail(String to, String code) {
        boolean useGmail = to.endsWith("@gmail.com");

        String username = useGmail ? gmailUsername : naverUsername;
        String password = useGmail ? gmailPassword : naverPassword;
        String smtpHost = useGmail ? "smtp.gmail.com" : "smtp.naver.com";
        String smtpPort = useGmail ? "587" : "465";

        Properties props = new Properties();
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", smtpPort);
        props.put("mail.smtp.auth", "true");

        if (useGmail) {
            props.put("mail.smtp.starttls.enable", "true"); // TLS
        } else {
            props.put("mail.smtp.ssl.enable", "true"); // SSL
            props.put("mail.smtp.socketFactory.port", smtpPort);
            props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            props.put("mail.smtp.socketFactory.fallback", "false");
        }

        // 인증 세션
        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(to)
            );
            message.setSubject("[폰살래말래] 이메일 인증번호 안내");
            message.setText(
                    "안녕하세요, 폰살래말래입니다!\n\n" +
                    "요청하신 인증번호는 [ " + code + " ] 입니다.\n\n" +
                    "인증번호는 5분간 유효하며, 외부에 유출되지 않도록 주의해주세요 😊\n\n" +
                    "감사합니다."
            );

            Transport.send(message);
            System.out.println("메일 전송 성공!");

        } catch (MessagingException e) {
            System.out.println("메일 전송 실패!");
            e.printStackTrace();
        }
    }
}
