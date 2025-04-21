package com.smhrd.controller;

import com.smhrd.config.GeminiApiConfig;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController // ✅ @Controller + @ResponseBody 합친 어노테이션
@RequestMapping("/api")
public class GeminiController {

    @PostMapping("/ask") // ✅ 더 직관적인 방식
    public ResponseEntity<String> askGemini(@RequestParam("phoneName") String phoneName) throws IOException {

        if (phoneName == null || phoneName.trim().isEmpty()) {
            return new ResponseEntity<>("{\"error\": \"모델명이 비어 있습니다.\"}", HttpStatus.BAD_REQUEST);
        }

        System.out.println(">> 받은 phoneName: " + phoneName);
        // 프롬프트
        String prompt = 
        	    "너는 중고폰 전문 평가자야. 아래 모델의 중고폰 시세 분석 보고서를 작성해줘. 모델명은: \"" + phoneName + "\"\n\n" +
        	    "⛔ 아래 지침을 꼭 지켜:\n" +
        	    "- 서론/설명 없이 분석 내용부터 바로 시작 (예: '알겠습니다' 같은 문구는 금지)\n\n" +
        	    "- 무조건 마크다운 테이블 |로 작성해 (탭이나 스페이스로 정렬하면 안 됨!)\n" +
        	    "- 테이블은 **헤더 포함**해서 아래와 같이 정확한 구조로 출력해:\n" +
        	    "다음 형식을 반드시 따라야 해. 항목을 건너뛰거나 순서를 바꾸거나 생략하지 마.\n" +
        	    "!!! 출력은 반드시 | 마크다운 테이블로 출력해. <details>나 <summary> 같은 HTML 태그는 절대 쓰지 마.\n\n" +
        	    "- 테이블은 **헤더 포함**해서 아래와 같이 정확한 구조로 출력해:\n" +
        	    "출력 순서는 아래와 같아:\n\n" +

        	    "▶ 평균 중고 시세 (2025년 기준):\n" +
        	    "- 예: **"+ phoneName + "**의 평균 중고가는 약 450,000원 ~ 550,000원입니다.**\n\n" +

        	    "▶ 1. 감가사항 분석:\n" +
        	    "| 항목 | 상세 원인 | 감가액 |\n" +
        	    "|------|------------|--------|\n" +
        	    "| 배터리 성능 저하 | 효율 90% 이하 | -30,000 ~ -50,000원 |\n" +
        	    "| 외관 손상 | 액정 파손 | -50,000 ~ -150,000원 |\n" +
        	    "(위와 같은 형식으로 최소 8개 이상 항목 작성)\n\n" +

        	    "▶ 2. 고질적인 문제점 분석:\n" +
        	    "| 카테고리 | 문제점 | 상세 설명 | 중고가 영향 |\n" +
        	    "|----------|--------|------------|---------------|\n" +
        	    "| 하드웨어 | 배터리 성능 저하 | 아이폰 14는 출시 후 2년 이상 경과하면 성능 저하가 일반적 | 효율 80% 미만 시 감가 큼 |\n" +
        	    "| 디스플레이 | 잔상 발생 | 장시간 사용 시 OLED 패널 특성상 발생 가능 | 상태에 따라 감가 반영 |\n" +
        	    "(위와 같은 형식으로 최소 4개 이상 작성)\n\n" +

        	    "▶ 3. 요약:\n" +
        	    "- 위 분석 내용을 5줄 이내로 요약\n\n" +

        	    "※ 출력 형식은 항상 마크다운 표 형식이어야 하며, 줄 간격과 테이블 구문이 정확해야 함.\n" +
        	    "※ 항목 누락 없이, 반드시 위의 표 틀에 맞춰 출력할 것.";


        // ▶ Gemini API 호출
        String apiKey = GeminiApiConfig.getApiKey();
        URL url = new URL("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setDoOutput(true);

        String jsonInput = "{ \"contents\": [{ \"parts\": [{ \"text\": \"" + prompt.replace("\"", "\\\"") + "\" }] }] }";

        try (OutputStream os = conn.getOutputStream()) {
            os.write(jsonInput.getBytes("UTF-8"));
        }

        StringBuilder responseText = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                responseText.append(line);
            }
        }

        String responseBody = responseText.toString();
        System.out.println("응답 본문: " + responseBody);

        // ▶ 응답 반환
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=UTF-8");

        return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
    }
}