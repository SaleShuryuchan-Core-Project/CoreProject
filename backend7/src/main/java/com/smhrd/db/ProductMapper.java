package com.smhrd.db;

import java.util.List;
import com.smhrd.model.PruductDetailDTO;

import com.smhrd.model.ProductDTO;

public interface ProductMapper {
//    List<ProductDTO> selectTop3Products();  // 추천 상품 3개
    
    public PruductDetailDTO detail(String p_idx);

	public void cart(PruductDetailDTO dto);

	List<ProductDTO> selectProducts(String phone);
}
