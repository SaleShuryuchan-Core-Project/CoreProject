import React, {useState} from 'react';
import '../css/cartpage.css'; // 아래 CSS 따로 설명

const initialItems = [
  {
    id: 1,
    name: '갤럭시S23플러스 256GB',
    model: 'SM-S916N',
    price: 450000,
    shipping: 3000,
    image: '/img/galaxy-s23.png',
    tags: ['중급', '단품', '확정', '선택', '변동'],
    date: '2023.08.07',
  },
  {
    id: 2,
    name: '갤럭시Z플립5 512GB',
    model: 'SM-F731N',
    price: 500000,
    shipping: 0,
    image: '/img/flip5.png',
    tags: ['중급', '단품', '확정', '선택', '변동'],
    date: '개통 2024.01.07',
  },
  {
    id: 3,
    name: '갤럭시S24울트라 512GB',
    model: 'SM-S928N',
    price: 1030000,
    shipping: 0,
    image: '/img/s24ultra.png',
    tags: ['상급', '풀박', '확정', '선택', '변동'],
    date: '개통 2024.01.27',
  },
];


const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialItems); // ✅ 상태로 변경
  const [checkItems, setCheckItems] = useState([]); // 체크된 아이템 id 저장
  const [checkAll, setCheckAll] = useState(false);       // 전체선택 상태 저장

  
  const handleCheckAll = () => {
    if(checkAll){
      setCheckItems([]);
    }else {
      setCheckItems(cartItems.map(item => item.id));
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
  
  // 체크박스 선택 및 삭제
  const handleCheckDelete = () => {
    const filteredItems = cartItems.filter(item => !checkItems.includes(item.id));
    setCartItems(filteredItems);           // ✅ 삭제 반영
    setCheckItems([]);                     // ✅ 체크 초기화
    setCheckAll(false);                    // ✅ 전체선택 해제
  };

  // 선택된 항목들 계산산
  const selectedItems = cartItems.filter(item => checkItems.includes(item.id));
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const totalShipping = selectedItems.reduce((acc, item) => acc + item.shipping, 0);


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
        <div key={item.id} className="cart-item">
          <input type="checkbox" checked={checkItems.includes(item.id)} 
          onChange={() => handleItemCheck(item.id)} />
          <img src={item.image} alt={item.name} className="cart-image" />
          <div className="cart-info">
            <div className="cart-name">{item.name}</div>
            <div className="cart-model">{item.model}</div>
            <div className="cart-tags">
              {item.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
            <div className="cart-date">{item.date}</div>
          </div>
          <div className="cart-price">
            <span>{item.price.toLocaleString()}원</span>
            <div className="shipping">{item.shipping === 0 ? '무료' : item.shipping.toLocaleString() + '원'}</div>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <div>상품금액 <span>{totalPrice.toLocaleString()}원</span></div>
        <div>배송비 <span>{totalShipping.toLocaleString()}원</span></div>
        <div className="final">주문총액 <span>{(totalPrice + totalShipping).toLocaleString()}원</span></div>
      </div>

      <button className="purchase-btn" disabled={checkItems.length === 0}>{checkItems.length}개 상품 구매하기</button>
    </div>
  );
};

export default CartPage;
