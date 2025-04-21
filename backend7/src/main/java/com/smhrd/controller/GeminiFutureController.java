package com.smhrd.controller;

import com.smhrd.config.GeminiApiConfig;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Controller
@RequestMapping("/api")
public class GeminiFutureController {

    @RequestMapping(value = "/future", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> estimateFuturePrice(HttpServletRequest request) throws IOException {
        request.setCharacterEncoding("UTF-8");

        // 프론트에서 "question" 키로 넘긴 프롬프트 받기
        String prompt = request.getParameter("question");
        System.out.println(">> 받은 프롬프트: \n" + prompt);

        if (prompt == null || prompt.trim().isEmpty()) {
            return new ResponseEntity<>("{\"error\": \"프롬프트가 비어 있음\"}", HttpStatus.BAD_REQUEST);
        }

        // Gemini API 요청 설정
        URL url = new URL("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GeminiApiConfig.getApiKey());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setDoOutput(true);

        String body = "{\n" +
                "  \"contents\": [\n" +
                "    {\n" +
                "      \"parts\": [\n" +
                "        {\n" +
                "          \"text\": \"" + prompt.replace("\"", "\\\"") + "\"\n" +
                "        }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.getBytes(StandardCharsets.UTF_8));
        }

        int responseCode = conn.getResponseCode();
        if (responseCode != 200) {
            System.err.println("Gemini API 응답 코드: " + responseCode);
            return new ResponseEntity<>("{\"error\": \"Gemini API 호출 실패: HTTP " + responseCode + "\"}", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // 응답 읽기
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        StringBuilder responseText = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            responseText.append(line);
        }
        br.close();

        // 응답을 그대로 React로 전달
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=UTF-8");
        return new ResponseEntity<>(responseText.toString(), headers, HttpStatus.OK);
    }
}
