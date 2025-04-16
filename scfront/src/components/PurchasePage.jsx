import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/productdetail.css"; // 스타일은 별도 CSS 파일로 분리
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/purchasepage.css';


const ProductDetailPage = () => {
  const { p_idx } = useParams(); // url의 num을 가져옴
  const [product, setProduct] = useState(null);

  const nav = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => { // 맞는 디테일 
    // 👉 GET 또는 POST 요청 가능. 여기서는 POST 예시로 진행
    axios.post("http://localhost:8083/controller/api/product/productDetail", { p_idx })
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("제품 정보 불러오기 실패:", err);
      });
  }, [p_idx]);


  const cart= () =>{
    axios.post("http://localhost:8083/controller/api/product/cart", {
      p_idx: p_idx,
      u_id: userInfo.u_id
    })
    .then((res)=>{
      if(res.data===1){
        alert("해당 제품을 장바구니의 추가하였습니다!")
        nav("/")
      }
    })
  }

  return (
    <div className="purchaseContainer">
      {/* product가 아직 null이면 아무것도 렌더링 안함 */}
      {!product ? (
        <div>로딩 중...</div>
      ) : (
        <div className="purchaseCard">
          <div className="mainImageWrapper">
            <img src="/img/sample-phone.png" alt="제품 이미지" className="mainProductImage" />
          </div>
          <div className="priceHighlight">{product.price}</div>

          <div className="productDetailList">
            <div className="detailRow">
              <span className="label">제품명</span>
              <span className="value">{product.p_name}</span>
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
              <span className="value">{product.created_at}</span>
            </div>
          </div>

          <div className="buyButtonWrapper">
            <button className="buyButton" onClick={cart}>장바구니</button>
            <button className="buyButton highlight" onClick={() => nav("/payment")} >바로구매</button>
          </div>
        </div>
      )}
    </div>
  );

};

export default ProductDetailPage;


