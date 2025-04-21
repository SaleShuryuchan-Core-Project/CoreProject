package com.smhrd.db;

import com.smhrd.model.OrderDetailsDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderDetailsMapper {

    // 전체 주문상세 조회
    public List<OrderDetailsDTO> selectAllDetails();

    // 주문상태 수정
    public int updateOrderStatus(OrderDetailsDTO dto);
    public int updateMainOrderStatus(@Param("order_idx") int order_idx, @Param("order_status") String order_status);  // 이거 추가
}