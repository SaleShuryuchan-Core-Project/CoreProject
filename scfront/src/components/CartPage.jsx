import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/cartpage.css';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [cartItems, setCartItems] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    axios.post("http://localhost:8083/controller/userCart", { u_id: userInfo.u_id })
      .then((res) => {
        setCartItems(res.data);
      });
  }, []);

  const handleCheckAll = () => {
    if (checkAll) {
      setCheckItems([]);
    } else {
      setCheckItems(cartItems.map(item => item.p_idx));
    }
    setCheckAll(!checkAll);
  };

  const handleItemCheck = (id) => {
    if (checkItems.includes(id)) {
      setCheckItems(checkItems.filter(itemId => itemId !== id));
    } else {
      setCheckItems([...checkItems, id]);
    }
  };

  const handleCheckDelete = () => {
    if (checkItems.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }

    axios.post("http://localhost:8083/controller/cartdelete", {
      u_id: userInfo.u_id,
      p_idx_list: checkItems
    }).then((res) => {
      if (res.data === "success") {
        const filteredItems = cartItems.filter(item => !checkItems.includes(item.p_idx));
        setCartItems(filteredItems);
        setCheckItems([]);
        setCheckAll(false);
        alert("삭제 완료!");
      } else {
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }).catch((err) => {
      console.error("삭제 오류:", err);
      alert("서버 오류로 삭제에 실패했습니다.");
    });
  };

  const selectedItems = cartItems.filter(item => checkItems.includes(item.p_idx));
  const totalPrice = selectedItems.reduce((acc, item) => acc + Number(item.price), 0);

  const handlePurchase = () => {
    nav('/payment', {
      state: { selectedItems } // ✅ 선택된 상품 정보 전체 넘기기
    });
  };

  return (
    <div className="cart-wrapper">
      <h2 className="cart-title">장바구니</h2>

      <div className="cart-header">
        <div className="cart-header-left">
          <input type="checkbox" checked={checkAll} onChange={handleCheckAll} />
          <span>전체선택</span>
        </div>
        <button className="delete-btn" onClick={handleCheckDelete}>선택상품 삭제</button>
      </div>

      {cartItems.map((item) => (
        <div key={item.p_idx} className="cart-item">
          <input
            type="checkbox"
            checked={checkItems.includes(item.p_idx)}
            onChange={() => handleItemCheck(item.p_idx)}
          />
          <img src={item.p_img1} alt={item.p_name} className="cart-image" />
          <div className="cart-info">
            <div className="cart-name">{item.p_name}</div>
            <div className="cart-model">상품번호: {item.p_idx}</div>
            <div className="cart-tags">
              <span className="tag">{item.p_status}</span>
              <span className="tag">{item.p_ownership === "0" ? '판매중' : item.p_ownership === "1" ? '거래완료' : '예약중'}</span>
            </div>
            <div className="cart-date">{item.created_at}</div>
          </div>
          <div className="cart-price">
            <span>{Number(item.price).toLocaleString()}원</span>
            <div className="shipping">무료</div>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <div>상품금액 <span>{totalPrice.toLocaleString()}원</span></div>
        <div>배송비 <span>0원</span></div>
        <div className="final">주문총액 <span>{totalPrice.toLocaleString()}원</span></div>
      </div>

      <button className="purchase-btn" disabled={checkItems.length === 0} onClick={handlePurchase}>
        {checkItems.length}개 상품 구매하기
      </button>
    </div>
  );
};

export default CartPage;
