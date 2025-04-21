package com.smhrd.config;

import java.util.Properties;
import java.io.InputStream;
import java.io.IOException;


public class GeminiApiConfig {
    private static String apiKey;

    static {
        try {
            Properties prop = new Properties();
            InputStream inputStream = GeminiApiConfig.class
                .getClassLoader()
                .getResourceAsStream("properties/config.properties"); // ★ 경로 중요

            if (inputStream == null) {
                throw new RuntimeException("config.properties 파일을 찾을 수 없습니다.");
            }

            prop.load(inputStream);
            apiKey = prop.getProperty("gemini.api.key");


        } catch (IOException e) {
            throw new RuntimeException("config.properties 로딩 실패", e);
        }
    }

    public static String getApiKey() {
        return apiKey;
    }
}
