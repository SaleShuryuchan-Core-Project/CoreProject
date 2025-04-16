import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/paymentpage.css';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const nav = useNavigate();
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const selectedPIdxList = selectedItems.map(item => item.p_idx); // ✅ 선택된 상품의 p_idx 리스트

  const [buyer, setBuyer] = useState({ name: '', phone1: '', phone2: '', phone3: '' });
  const [delivery, setDelivery] = useState({
    recipient: '', phone1: '', phone2: '', phone3: '', zipcode: '', address: '', detail: '', memo: ''
  });

  const postcodeRef = useRef(null);
  const roadAddressRef = useRef(null);
  const jibunAddressRef = useRef(null);
  const guideRef = useRef(null);

  useEffect(() => {
    if (!window.daum || !window.daum.Postcode) {
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    }
  }, []);

  const sample4_execDaumPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const roadAddr = data.roadAddress;
          let extraRoadAddr = "";
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraRoadAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraRoadAddr += (extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName);
          }
          if (extraRoadAddr !== "") {
            extraRoadAddr = " (" + extraRoadAddr + ")";
          }
          if (postcodeRef.current) postcodeRef.current.value = data.zonecode;
          if (roadAddressRef.current) roadAddressRef.current.value = roadAddr;
          if (jibunAddressRef.current) jibunAddressRef.current.value = data.jibunAddress;
          setDelivery(prev => ({
            ...prev,
            zipcode: data.zonecode,
            address: data.roadAddress || data.jibunAddress,
          }));
          if (guideRef.current) {
            if (data.autoRoadAddress) {
              const expRoadAddr = data.autoRoadAddress + extraRoadAddr;
              guideRef.current.innerHTML = `(예상 도로명 주소 : ${expRoadAddr})`;
              guideRef.current.style.display = "block";
            } else if (data.autoJibunAddress) {
              const expJibunAddr = data.autoJibunAddress;
              guideRef.current.innerHTML = `(예상 지번 주소 : ${expJibunAddr})`;
              guideRef.current.style.display = "block";
            } else {
              guideRef.current.innerHTML = "";
              guideRef.current.style.display = "none";
            }
          }
        },
      }).open();
    } else {
      console.error("Daum Postcode SDK가 로드되지 않았습니다.");
    }
  };

  const handleBuyerChange = (e) => setBuyer({ ...buyer, [e.target.name]: e.target.value });
  const handleDeliveryChange = (e) => setDelivery({ ...delivery, [e.target.name]: e.target.value });
  const handleLoadUserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) return alert("회원 정보가 없습니다!");
    const phone = userInfo.phone || "";
    const [phone1, phone2, phone3] = [phone.substring(0, 3), phone.substring(3, 7), phone.substring(7, 11)];
    const addrParts = userInfo.addr.split("_");
    setDelivery({ ...delivery, recipient: userInfo.name, phone1, phone2, phone3,
      zipcode: addrParts?.[0] || '', address: addrParts?.[1] || '', detail: addrParts?.[3] || '', });
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);

  const handleSubmit = () => {
    const IMP = window.IMP;
    if (!IMP) return alert("결제 모듈 로딩 실패!");
    IMP.init("imp74573306");
    IMP.request_pay({
      pg: "html5_inicis", pay_method: "card", name: "테스트 결제", amount: totalAmount,
      buyer_name: buyer.name, buyer_tel: `${buyer.phone1}-${buyer.phone2}-${buyer.phone3}`,
      buyer_addr: `${delivery.address} ${delivery.detail}`, buyer_postcode: delivery.zipcode,
    }, rsp => {
      if (rsp.success) alert("✅ 결제 성공! imp_uid: " + rsp.imp_uid);
      else alert("❌ 결제 실패: " + rsp.error_msg);
    });
  };

  const handleFakeOrder = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const discount = 0;
    const payAmount = totalAmount - discount;
    const orderData = {
      u_id: userInfo.u_id,
      total_amount: totalAmount,
      discount_amount: discount,
      pay_amount: payAmount,
      pay_method: "모의결제",
      paid_amount: payAmount,
      order_status: "배송준비중",
      delivery_company: "무관",
      order_msg: delivery.memo || "",
      p_idx_list: selectedPIdxList // ✅ 선택된 제품 ID 리스트 추가
    };
    try {
      const res = await axios.post("http://localhost:8083/controller/fake", orderData);
      if (res.data === "success"){ alert("📦 모의 주문 저장 완료! (배송준비중)") 
        nav("/");
      }else{ alert("⛔ 주문 저장 실패")};
    } catch (err) {
      console.error("모의 주문 에러:", err);
      alert("서버 오류! 콘솔 확인");
    }
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">주문 / 결제</h2>
      {selectedItems.map(item => (
        <div className="product-box" key={item.p_idx}>
          <img src={`http://localhost:8083${item.p_img1}`} alt="상품 이미지" className="product-img" />
          <div className="product-info">
            <div className="product-name">{item.p_name}</div>
            <div className="product-color">상품번호: {item.p_idx}</div>
          </div>
          <div className="price">{Number(item.price).toLocaleString()} <span className="won">원</span></div>
        </div>
      ))}

      <div className="section">
        <h3>구매자</h3>
        <input name="name" className="name-input" placeholder="이름" onChange={handleBuyerChange} />
        <div className="inline-group">
          <input name="phone1" placeholder="핸드폰번호" maxLength={3} onChange={handleBuyerChange} />
          <span>-</span>
          <input name="phone2" maxLength={4} onChange={handleBuyerChange} />
          <span>-</span>
          <input name="phone3" maxLength={4} onChange={handleBuyerChange} />
        </div>
      </div>

      <div className="section">
        <h3>배송지</h3>
        <div className="radio-group">
          <label><input type="radio" name="addr" onClick={handleLoadUserInfo} /> 회원 정보 불러오기</label>
          <label><input type="radio" name="addr" defaultChecked /> 신규 입력</label>
        </div>

        <input name="recipient" className="receiver-input" placeholder="수령인" value={delivery.recipient} onChange={handleDeliveryChange} />
        <div className="inline-group">
          <input name="phone1" placeholder="핸드폰번호" maxLength={3} value={delivery.phone1} onChange={handleDeliveryChange} />
          <span>-</span>
          <input name="phone2" maxLength={4} value={delivery.phone2} onChange={handleDeliveryChange} />
          <span>-</span>
          <input name="phone3" maxLength={4} value={delivery.phone3} onChange={handleDeliveryChange} />
        </div>

        <div className="zip-search-row">
          <input name="zipcode" className="zipcode-input" placeholder="우편번호" ref={postcodeRef} value={delivery.zipcode} readOnly />
          <button className="search-btn" type="button" onClick={sample4_execDaumPostcode}>검색</button>
        </div>

        <input name="address" placeholder="주소" ref={roadAddressRef} value={delivery.address} readOnly />
        <input name="detail" placeholder="상세주소" value={delivery.detail} onChange={handleDeliveryChange} />
        <textarea name="memo" placeholder="배송시 요청사항" onChange={handleDeliveryChange}></textarea>
        <span id="guide" ref={guideRef} style={{ color: '#999', display: 'none' }}></span>
      </div>

      <div className="total-amount">총 결제 금액: <strong>{totalAmount.toLocaleString()}원</strong></div>
      <div className="button-group">
        <button className="pay-btn small" onClick={handleSubmit}>결제하기</button>
        <button className="pay-btn small" onClick={handleFakeOrder}>결제테스트</button>
      </div>
    </div>
  );
};

export default PaymentPage;
