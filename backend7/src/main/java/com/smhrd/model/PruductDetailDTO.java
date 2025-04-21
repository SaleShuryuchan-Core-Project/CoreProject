package com.smhrd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PruductDetailDTO {
	
	private String p_idx;
	private String p_name;
	private int price;
	private String p_status;
	private String p_ownership;
	private String created_at;
	private String p_img1;
	private String p_img2;
	private String p_img3;
	private String u_id;
	private String color;
}
