package com.smhrd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 				// getter, setter 연결하기 위한 Annotation
@AllArgsConstructor // 생성자 메소드를 연결하기 위한 Annotation
@NoArgsConstructor  // 기본 생성자 메소드를 연결하기 위한 Annotation
public class TestDTO {
	
	private String id;
	private String pw;
	private String name;
	private String nickname;
	private String phone;
	private String email;
	private String zipcode1;
	private String zipcode2;
	private String address;
	private String detailAddress;

}
