package com.smhrd.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.db.TestMapper;
import com.smhrd.model.KakaoDTO;
import com.smhrd.model.OrderDTO;
import com.smhrd.model.ProductDTO;
import com.smhrd.model.TestDTO;
import com.smhrd.model.SendDTO;
import com.smhrd.model.PruductDetailDTO;
import com.smhrd.model.UserReqDTO;
import com.smhrd.model.UserRevDTO;
import com.smhrd.model.CartDTO;
import com.smhrd.model.CartDeleteDTO;

@RestController
public class ReactTestController {

	@Autowired
	TestMapper mapper;

	@Autowired
	private EmailService emailService; // 이메일 인증용도

	private Map<String, String> emailCodeMap = new HashMap<>(); // 이메일 인증용도

	@RequestMapping("/")
	public String redirectToHello() { // 일단 연결되는곳
		return "home";
	}

	@PostMapping("/join")
	public int join(@RequestBody TestDTO dto) { // 회원 가입

		mapper.join(dto);

		return 1;
	}

	@PostMapping("/check")
	public int check(@RequestBody TestDTO dto, TestDTO dto1) { // 중복체크
		System.out.println(dto.getNickname());
		if (dto.getNickname().equals("")) {
			dto1 = mapper.idCheck(dto.getId());
		} else {
			dto1 = mapper.nickCheck(dto.getNickname());
		}
		if (dto1 != null) {
			return 0; // 중복됨
		} else {
			return 1; // 사용가능함
		}
	}

	@PostMapping("/login")
	public SendDTO login(@RequestBody TestDTO dto) { // 일반 로그인

		SendDTO dto1 = mapper.login(dto);

		if (dto1 != null) {
			return dto1; // 로그인 성공
		} else {
			return dto1;
		}
	}

	@PostMapping("/kakaologin")
	public SendDTO kakaologin(@RequestBody KakaoDTO dto, SendDTO dto1) { // 카카오 회원가입 및 로그인

		dto1 = mapper.kakaoLogin(dto);

		if (dto1 == null) {
			mapper.kakaoJoin(dto);
		} else {
			return dto1;
		}
		SendDTO dto2 = mapper.kakaoLogin(dto);
		return dto2; // 가입 성공
	}

	@PostMapping("/sendEmail")
	public ResponseEntity<?> sendMail(@RequestBody Map<String, String> data) { // 이메일 인증 보내기
		String email = data.get("email");
		String code = generateCode(); // 랜덤한 6자리를 생성하는 함수 호출
		System.out.println(code);
		emailService.sendMail(email, code);
		emailCodeMap.put(email, code);
		return ResponseEntity.ok("전송 완료");
	}

	private String generateCode() { // 100000 ~ 999999 사이의 6자리 숫자가 랜덤으로 생성하는 함수
		return String.valueOf((int) (Math.random() * 900000) + 100000);
	}

	@PostMapping("/verifyCode")
	public ResponseEntity<Boolean> verifyCode(@RequestBody Map<String, String> data) { // 인증 번호 확인하기
		String email = data.get("email"); // 사용자가 인증 요청한 이메일
		String inputCode = data.get("code"); // 사용자가 입력한 인증번호
		String savedCode = emailCodeMap.get(email); // 서버에 저장된 인증번호

		boolean result = inputCode != null && inputCode.equals(savedCode);

		return ResponseEntity.ok(result); // true면 성공, false면 실패
	}

	@PostMapping("/update")
	public SendDTO update(@RequestBody TestDTO dto, SendDTO dto1) { // 정보수정
		mapper.update(dto);
		dto1 = mapper.login(dto);

		return dto1;
	}

	@PostMapping("/delete")
	public int delete(@RequestBody TestDTO dto) { // 회원탈퇴
		mapper.delete(dto.getId());
		return 1;
	}

	@PostMapping("/pwchange")
	public int pwchange(@RequestBody TestDTO dto) { // 비밀번호 변경
		mapper.pwchange(dto);
		return 1;
	}

	@PostMapping("/mypageorder")
	public List<OrderDTO> mypageorder(@RequestBody OrderDTO dto) { // 마이페이지 주문내역 가져오기
		System.out.println("ord" + dto.getU_id());
		List<OrderDTO> dto1 = mapper.orderInfo(dto.getU_id());
		for (int i = 0; i < dto1.size(); i++) {
			PruductDetailDTO dto2 = mapper.orderProduct(dto1.get(i).getOrder_idx());

			if (dto2 != null) {
				dto1.get(i).setP_name(dto2.getP_name());
			} else {
				System.out.println("❗주문 상세 정보 없음! order_idx: " + dto1.get(i).getOrder_idx());
				dto1.get(i).setP_name("상품정보없음"); // or 생략 가능
			}
		}

		System.out.println("dto1: " + dto1);
		System.out.println("dto1.get(0): " + dto1.get(0));
		System.out.println("dto1.get(0).getOrder_idx(): " + dto1.get(0).getOrder_idx());
		return dto1;
	}

	@PostMapping("/mypageReq")
	public List<UserReqDTO> mypageReq(@RequestBody UserReqDTO dto) {
		System.out.println("req" + dto.getU_id());
		List<UserReqDTO> dto1 = mapper.req(dto.getU_id());
		System.out.println("req" + dto1);
		// 나중에 추가기능 가능
		return dto1;
	}

	@PostMapping("/mypageRev")
	public List<UserRevDTO> mypageRev(@RequestBody UserRevDTO dto) {
		System.out.println("rev" + dto.getU_id());
		List<UserRevDTO> dto1 = mapper.rev(dto.getU_id());
		System.out.println("rev" + dto1);
		// 나중에 추가기능 가능
		return dto1;
	}

	@PostMapping("/userCart")
	public List<CartDTO> userCart(@RequestBody CartDTO dto) { // 장바구니 꺼내오기 
		System.out.println(dto.getU_id());
		List<CartDTO> dto1 = mapper.userCart(dto.getU_id());
		List<CartDTO> dto2 = new ArrayList<>();
		for (int i = 0; i < dto1.size(); i++) {
			dto2.add(mapper.productList(dto1.get(i).getP_idx()));
		}
		return dto2;
	}

	@PostMapping("/cartdelete")
	@ResponseBody
	public String deleteCartItems(@RequestBody CartDeleteDTO dto) {
		String u_id = dto.getU_id();
		List<Integer> p_idx_list = dto.getP_idx_list();

		for (Integer p_idx : p_idx_list) {
			mapper.deleteCartItem(u_id, p_idx);
		}

		return "success";
	}

	@PostMapping("/fake")
    public String insertFakeOrder(@RequestBody OrderDTO dto) {
        try {
            mapper.insertOrder(dto);

            // ✅ 주문된 상품들의 상태를 '판매완료'로 일괄 업데이트
            if (dto.getP_idx_list() != null && !dto.getP_idx_list().isEmpty()) {
                mapper.updateProductStatusToSold(dto.getP_idx_list());
            }

            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }
	
	////////////////// 사진 api 테스트중

	@PostMapping("/add")
	public int add(@RequestBody ProductDTO dto) {
		System.out.println("컨트롤러 들어옴: " + dto);
	    mapper.add(dto);
	    return 1;
	}

	@PostMapping("/recommend")
	public List<ProductDTO> getRecommendedProducts() {
	    return mapper.selectRecommendedProducts();
	}
	
    @PostMapping("/send-pw-auth")
    public boolean sendPasswordAuth(@RequestBody Map<String, String> request) { //// 비밀번호 찾기 - 인증번호 발송
        String id = request.get("id");
        String email = request.get("email");

        // ID와 이메일 일치 확인
        String emailFromDb = mapper.selectEmailByUserId(id);
        if (emailFromDb != null && emailFromDb.equals(email)) {
            String code = generateCode();
            emailService.sendMail(email, code);
            emailCodeMap.put(email + ":" + id, code); // 이메일과 ID를 묶어서 저장
            return true;
        }
        return false;
    }

    @PostMapping("/verify-pw-auth")
    public Map<String, String> verifyPasswordAuth(@RequestBody Map<String, String> request) { // 비밀번호 찾기 - 인증번호 확인
        String inputCode = request.get("code");
        String inputEmail = request.get("email");
        String inputId = request.get("id");

        String savedCode = emailCodeMap.get(inputEmail + ":" + inputId);
        Map<String, String> result = new HashMap<>();

        if (savedCode != null && savedCode.equals(inputCode)) {
            String pw = mapper.selectPasswordByUserId(inputId);
            result.put("password", pw);
        }

        return result;
    }
	

    @PostMapping("/send-id-auth")
    public boolean sendIdAuth(@RequestBody Map<String, String> request) { // 아이디 찾기 - 인증번호 발송
        String email = request.get("email");

        // DB에 이메일이 있는지 확인
        String idFromDb = mapper.selectUserIdByEmail(email);
        if (idFromDb != null) {
            String code = generateCode();
            emailService.sendMail(email, code);
            emailCodeMap.put(email, code); // 이메일 기반으로 저장
            return true;
        }
        return false;
    }

    
    @PostMapping("/verify-id-auth")
    public Map<String, String> verifyIdAuth(@RequestBody Map<String, String> request) { // 아이디 찾기 - 인증번호 확인
        String email = request.get("email");
        String inputCode = request.get("code");

        String savedCode = emailCodeMap.get(email);
        Map<String, String> result = new HashMap<>();

        if (savedCode != null && savedCode.equals(inputCode)) {
            String id = mapper.selectUserIdByEmail(email);
            result.put("userId", id); // 성공 시 아이디 반환
        }

        return result;
    }

    @PostMapping("/send-sms")
    public String sendSMS(@RequestBody Map<String, String> payload) {
        String phoneNumber = payload.get("phoneNumber");

        try {
            SMSService.sendSMS(phoneNumber);  // 서비스 메소드 호출
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }

	
}
