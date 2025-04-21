package com.smhrd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendDTO {
	
	private String u_id;
	private String pw;
	private String name;
	private String nick;
	private String phone;
	private String email;
	private String addr;
	private String u_role;
}
