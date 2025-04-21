package com.smhrd.controller;

import com.smhrd.model.OrderDetailsDTO;
import com.smhrd.db.OrderDetailsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
public class OrderDetailsController {

    @Autowired
    private OrderDetailsMapper mapper;

    // 주문상세 전체 목록 가져오기
    @GetMapping("/details")
    public List<OrderDetailsDTO> getOrderDetails() {
        return mapper.selectAllDetails();
    }

    // 주문 상태 업데이트 처리
    @PostMapping("/updateStatus")
    public String updateOrderStatus(@RequestBody OrderDetailsDTO dto) {
        System.out.println("📦 받은 요청 DTO: " + dto);
        try {
//            int result1 = mapper.updateOrderStatus(dto);
            int result2 = mapper.updateMainOrderStatus(dto.getOrder_idx(), dto.getOrder_status());
            return (result2 > 0) ? "success" : "fail";
        } catch (Exception e) {
            e.printStackTrace(); // 🔥 에러 전체 출력
            return "fail";
        }
    }


}
