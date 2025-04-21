package com.smhrd.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

	@GetMapping("/check")
	public Map<String, Object> checkNotification() {
	    Map<String, Object> result = new HashMap<>();
	    result.put("hasNew", true); // 실제 DB 확인 로직으로 대체 가능
	    result.put("message", "요청하신 글에 답변이 등록되었습니다!");
	    return result;
	}
}
