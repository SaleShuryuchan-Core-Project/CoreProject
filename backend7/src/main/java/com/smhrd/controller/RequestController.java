package com.smhrd.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.smhrd.db.RequestMapper;
import com.smhrd.model.RequestDTO;

@RestController
@RequestMapping("/api/request")
public class RequestController {

    @Autowired
    private RequestMapper mapper;

    @PostMapping("/write")
    public String writeRequest(@RequestBody RequestDTO dto) {
    	System.out.println("받은 값: " + dto.toString());
        int result = mapper.insertRequest(dto);
        return result > 0 ? "success" : "fail";
    }

    @PostMapping("/list")
    public List<RequestDTO> list() {
        return mapper.getAllRequests();
    }

    @PostMapping("/reqdetail")
    public RequestDTO detail(@RequestBody Map<String, Integer> param) {
        int id = param.get("id");
        return mapper.getRequestDetail(id);
    }
}