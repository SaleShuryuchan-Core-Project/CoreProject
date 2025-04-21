package com.smhrd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserReqDTO {
	
	private String u_id;
	private String req_idx;
	private String req_title;
	private String req_content;
	private String created_at;

}
