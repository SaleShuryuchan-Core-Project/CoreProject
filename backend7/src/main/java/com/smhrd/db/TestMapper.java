package com.smhrd.db;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.smhrd.model.KakaoDTO;
import com.smhrd.model.TestDTO;
import com.smhrd.model.UserReqDTO;
import com.smhrd.model.UserRevDTO;
import com.smhrd.model.SendDTO;
import com.smhrd.model.OrderDTO;
import com.smhrd.model.ProductDTO;
import com.smhrd.model.PruductDetailDTO;
import com.smhrd.model.CartDTO;

@Mapper
public interface TestMapper {
	
	public int join(TestDTO dto); // 가입
	
	public TestDTO idCheck(String check); //아이디 체크
	
	public TestDTO nickCheck(String check); // 닉네임 체크
	
	public SendDTO login(TestDTO dto); // 로그인 확인
	
	public SendDTO kakaoLogin(KakaoDTO dto); // 카카오 로그인
	
	public void kakaoJoin(KakaoDTO dto); // 카카오 가입
	
	public void update(TestDTO dto); // 정보 수정
	
	public void delete(String id); // 회원 탈퇴

	public void pwchange(TestDTO dto);

	public List<OrderDTO> orderInfo(String u_id);

	public PruductDetailDTO orderProduct(String order_idx);

	public List<UserReqDTO> req(String u_id);

	public List<UserRevDTO> rev(String u_id);

	public List<CartDTO> userCart(String u_id);

	public CartDTO productList(String p_idx);

	public void deleteCartItem(@Param("u_id") String u_id, @Param("p_idx") Integer p_idx);
	 
	public void insertOrder(OrderDTO dto);
	 
	public void updateProductStatusToSold(@Param("p_idx_list") List<Integer> p_idx_list);

	public void add(ProductDTO dto);

	public List<ProductDTO> selectRecommendedProducts();
	
	public String selectEmailByUserId(String id);
	 
	public String selectPasswordByUserId(String id);
	
	public String selectUserIdByEmail(String email);
}
