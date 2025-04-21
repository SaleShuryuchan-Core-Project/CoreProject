package com.smhrd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
	private int p_idx; // ✅ INT로 변경
	private String p_name;
	private int price;
	private String p_status;
	private String create_at;
	private int p_ownership;
	private String p_img1;
	private String p_img2;
	private String p_img3;
	private String color;
}

