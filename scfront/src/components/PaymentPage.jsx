import React, { useState } from 'react';
import '../css/paymentpage.css'; // 별도 CSS 파일도 같이 만들어줄게

const PaymentPage = () => {
  const [buyer, setBuyer] = useState({
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
  });

  const [delivery, setDelivery] = useState({
    recipient: '',
    phone1: '',
    phone2: '',
    phone3: '',
    zipcode: '',
    address: '',
    detail: '',
    memo: '',
  });

  const handleBuyerChange = (e) => {
    setBuyer({ ...buyer, [e.target.name]: e.target.value });
  };

  const handleDeliveryChange = (e) => {
    setDelivery({ ...delivery, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert('결제 처리 중...');
    // 여기에 결제 API 또는 다음 단계 처리
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">주문 / 결제</h2>
      <div className="product-box">
        <img src="/img/iphone12pro.png" alt="상품 이미지" className="product-img" />
        <div className="product-info">
          <div className="product-name">아이폰12 PRO MAX 258G</div>
          <div className="product-color">공란</div>
        </div>
        <div className="price">495,000 <span className="won">원</span></div>
      </div>

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
          <label><input type="radio" name="addr" /> 회원 정보 불러오기</label>
          <label><input type="radio" name="addr" defaultChecked /> 신규 입력</label>
        </div>

        <input name="recipient" className="receiver-input" placeholder="수령인" onChange={handleDeliveryChange} />
        <div className="inline-group">
          <input name="phone1" placeholder="핸드폰번호" maxLength={3} onChange={handleDeliveryChange} />
          <span>-</span>
          <input name="phone2" maxLength={4} onChange={handleDeliveryChange} />
          <span>-</span>
          <input name="phone3" maxLength={4} onChange={handleDeliveryChange} />
        </div>

        <div className="zip-search-row">
          <input
            name="zipcode"
            className="zipcode-input"
            placeholder="우편번호"
            onChange={handleDeliveryChange}
          />
          <button className="search-btn">검색</button>
        </div>

        <input name="address" placeholder="주소" onChange={handleDeliveryChange} />
        <input name="detail" placeholder="상세주소" onChange={handleDeliveryChange} />
        <textarea name="memo" placeholder="배송시 요청사항" onChange={handleDeliveryChange}></textarea>
      </div>

      <button className="pay-btn" onClick={handleSubmit}>결제하기</button>
    </div>
  );
};

export default PaymentPage;
