package com.smhrd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRevDTO {
	
	private String u_id;
	private String p_idx;
	private String review_idx;
	private String review_content;
	private String review_ratings;
	private String created_at;

}
