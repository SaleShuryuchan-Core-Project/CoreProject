package com.smhrd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ReviewDTO {
    private int review_idx;
    private int p_idx;               // 제품번호 (임시로 고정값 쓸 예정)
    private String review_content;
    private double review_ratings;
    private String review_img;
    private String created_at;
    private String u_id;
}
