package com.smhrd.controller;

import okhttp3.*;

public class SMSService {

    // ✅ 발급받은 키 값 여기 넣기 (절대 유출 ❌)
    private static final String API_KEY = "NCSRUQSCKMPI39GG";
    private static final String API_SECRET = "VMZH8S4H5UXF3LW6SOTEVFLOOHYLJTH8";
    private static final String SENDER = "01095249907";  // 발신번호

    public static void sendSMS(String to) throws Exception {
        OkHttpClient client = new OkHttpClient();

        to = to.replaceAll("-", "");  // ✅ 수신번호에서 하이픈 제거
        String sender = SENDER.replaceAll("-", "");  // ✅ 발신번호도 하이픈 제거

        MediaType mediaType = MediaType.parse("application/json");
        String json = "{"
            + "\"messages\":[{\"to\":\"" + to + "\",\"from\":\"" + sender + "\",\"text\":\"[폰 살래 말래] 인증번호는 123456 입니다.\"}],"
            + "\"api_key\":\"" + API_KEY + "\","
            + "\"api_secret\":\"" + API_SECRET + "\""
            + "}";

        RequestBody body = RequestBody.create(json, mediaType);
        Request request = new Request.Builder()
            .url("https://api.solapi.com/messages/v4/send")
            .post(body)
            .addHeader("Content-Type", "application/json")
            .build();

        Response response = client.newCall(request).execute();
        System.out.println(response.body().string());
    }

}
