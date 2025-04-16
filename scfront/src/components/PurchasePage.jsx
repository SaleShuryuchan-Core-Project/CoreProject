import React from 'react';
import '../css/purchasepage.css';

const PurchasePage = () => {
  return (
    <div className="purchaseContainer">
      <div className="purchaseCard">
        {/* 메인 제품 이미지 */}
        <div className="mainImageWrapper">
          <img src="/img/sample-phone.png" alt="제품 이미지" className="mainProductImage" />
        </div>

        {/* 가격 강조 */}
        <div className="priceHighlight">495,000원</div>

        {/* 주요 정보 나열 */}
        <div className="productDetailList">
          <div className="detailRow">
            <span className="label">제품명</span>
            <span className="value">아이폰12 PRO MAX 258G</span>
          </div>
          <div className="detailRow">
            <span className="label">통신사</span>
            <span className="value">모든 통신사에서 사용가능</span>
          </div>
          <div className="detailRow">
            <span className="label">개통일</span>
            <span className="value">미확인</span>
          </div>
          <div className="detailRow">
            <span className="label">안전거래</span>
            <span className="value">가능</span>
          </div>
          <div className="detailRow" id="registDay">
            <span className="label">등록일</span>
            <span className="value">2025-03-25</span>
          </div>
        </div>

        {/* 구매 버튼 */}
        <div className="buyButtonWrapper">
          <button className="buyButton">장바구니</button>
          <button className="buyButton highlight">바로구매</button>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
