package com.smhrd.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {

	private String p_name;
	private String order_idx;
	private String u_id;
	private String total_amount;
	private String discount_amount;
	private String pay_amount;
	private String pay_method;
	private String paid_amount;
	private String order_status;
	private String delivery_company;
	private String order_msg;
	private String created_at; // TIMESTAMP는 문자열로 받아도 OK
	private String p_idx;
	private List<Integer> p_idx_list;

}
