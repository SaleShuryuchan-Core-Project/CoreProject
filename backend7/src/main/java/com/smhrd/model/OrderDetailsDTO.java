package com.smhrd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailsDTO {
	private int detail_idx;
	private int order_idx;
	private int p_idx;
	private int cnt;
	private String order_status;
}
