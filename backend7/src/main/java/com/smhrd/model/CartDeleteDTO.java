package com.smhrd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDeleteDTO {
    private String u_id;                // 유저 ID
    private List<Integer> p_idx_list;   // 선택된 상품 ID 리스트
}
