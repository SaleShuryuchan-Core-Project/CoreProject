package com.smhrd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.smhrd.db.ProductMapper;
import com.smhrd.model.ProductDTO;
import com.smhrd.model.PruductDetailDTO;

@Controller
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductMapper productMapper;

    @ResponseBody  // ✅ 여기만 붙여줘!
    @GetMapping("/recommend")
    public List<ProductDTO> recommend(@RequestParam("phone") String phone) {
    	System.out.println("보유제품 찾기 "+phone);
        return productMapper.selectProducts(phone);
    }
    
    
    @ResponseBody
    @GetMapping("/ping")
    public String testPing() {
        return "pong";
    }
    
    @ResponseBody
    @PostMapping("/productDetail")
    public PruductDetailDTO detail(@RequestBody PruductDetailDTO dto) {
    	System.out.println(dto.getP_idx());
    	return	productMapper.detail(dto.getP_idx());
    	
    }
    
    @ResponseBody
    @PostMapping("/cart") 
	public int cart(@RequestBody PruductDetailDTO dto) { //장바구니 추가하기
    	System.out.println(dto.getU_id());
    	System.out.println(dto.getP_idx());
		
    	productMapper.cart(dto);
    	
		return 1;
	}

}
