import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import "../css/productdetail.css"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/purchasepage.css';
import Future from "./Future";


const PurchasePage = ({ openLoginSidePage }) => {

  const [showFutureModal, setShowFutureModal] = useState(false);
  const { p_idx } = useParams(); // url의 num을 가져옴
  const [product, setProduct] = useState(null);

  const nav = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    axios.post("http://localhost:8083/controller/api/product/productDetail", { p_idx })
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("제품 정보 불러오기 실패:", err);
      });
  }, [p_idx]);


  const cart = () => {
    if (!userInfo) {
      alert("로그인 후 이용해주세요.");
      openLoginSidePage(); // ✅ 사이드 로그인 창 열기
      return;
    }
  
    axios.post("http://localhost:8083/controller/api/product/cart", {
      p_idx: p_idx,
      u_id: userInfo.u_id
    }).then((res) => {
      if (res.data === 1) {
        alert("해당 제품을 장바구니에 추가하였습니다!");
        nav("/");
      }
    });
  };

  const payment = () => {
    if (!userInfo) {
      alert("로그인 후 이용해주세요.");
      openLoginSidePage(); // ✅ 사이드 로그인 창 열기
      return;
    }
  
    nav('/payment', {
      state: { selectedItems: [product] }
    });
  };

  useEffect(() => {
    if (showFutureModal) {
      document.body.style.overflow = 'hidden'; // 스크롤 막기
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => (document.body.style.overflow = 'auto');
  }, [showFutureModal]);


  return (
    <div className="purchaseContainer">
      {/* product가 아직 null이면 아무것도 렌더링 안함 */}
      {!product ? (
        <div>로딩 중...</div>
      ) : (
        <div className="purchaseCard">
          <div className="mainImageWrapper">
            <img src={product.p_img1} alt={product.p_name} className="mainProductImage" />
            <img src={product.p_img2} alt={product.p_name} className="mainProductImage" />
            <img src={product.p_img3} alt={product.p_name} className="mainProductImage" />
          </div>
          <div className="priceHighlight">
            {Number(product.price).toLocaleString()} 원
          </div>
          <div className="futureHighlight">
            {/* ✅ 버튼 생성 */}
            <button className="futurePrice-btn" onClick={() => setShowFutureModal(true)}>1년 뒤 예상 시세</button>
          </div>
          {/* ✅ Future 컴포넌트를 모달로 출력 */}
          {showFutureModal && (
            <div
              className="modal-overlay"
              onClick={(e) => {
                // ✅ 오직 바깥쪽만 눌렀을 때만 꺼지도록
                if (e.target === e.currentTarget) {
                  setShowFutureModal(false);
                }
              }}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()} // 내부 클릭은 이벤트 전파 막기
                style={{ position: "relative" }}
              >
                <Future
                  modelName={product.p_name}
                  color={product.color}
                  기변상태={product.p_status}
                />
              </div>
            </div>
          )}

          <div className="productDetailList">
            <div className="detailRow">
              <span className="label">제품명</span>
              <span className="value">{product.p_name}</span>
            </div>
            <div className="detailRow">
              <span className="label">색상</span>
              <span className="value">{product.color}</span>
            </div>
            <div className="detailRow">
              <span className="label">통신사</span>
              <span className="value">모든 통신사에서 사용가능</span>
            </div>
            <div className="detailRow">
              <span className="label">안전거래</span>
              <span className="value">가능</span>
            </div>
            <div className="detailRow" id="registDay">
              <span className="label">등록일</span>
              <span className="value">{product.created_at}</span>
            </div>
          </div>
          <div className="productDetailList">
            <div className="detailRow">
              <span className="label">상세설명</span>
              <span className="value">{product.p_status}</span>
            </div>
          </div>
          <div className="buyButtonWrapper">
            <button className="buyButton" onClick={cart}>장바구니</button>
            <button className="buyButton highlight" onClick={payment} >바로구매</button>
          </div>
        </div>
      )}
    </div>
  );

};

export default PurchasePage;