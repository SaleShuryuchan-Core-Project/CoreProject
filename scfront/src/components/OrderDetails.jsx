import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/orderdetails.css';
import { useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [statusList, setStatusList] = useState([]); // ✅ 인덱스 기반 상태 리스트
  const nav = useNavigate();

  // ✅ 주문 상세 불러오면서 상태 리스트 초기화
  useEffect(() => {
    axios.get("http://localhost:8083/controller/api/order/details")
      .then(res => {
        setOrderDetails(res.data);
        setStatusList(res.data.map(item => item.order_status)); // 초기 상태 세팅
      })
      .catch(err => {
        console.error("주문상세 불러오기 실패:", err);
      });
  }, []);

  // ✅ 드롭다운 변경 핸들러
  const handleStatusChange = (index, newStatus) => {
    const newStatusList = [...statusList];
    newStatusList[index] = newStatus;
    setStatusList(newStatusList);
  };

  // ✅ 서버 반영
  const handleUpdateClick = (index) => {
    const item = orderDetails[index];
    const updatedStatus = statusList[index];

    axios.post("http://localhost:8083/controller/api/order/updateStatus", {
      detail_idx: item.detail_idx,
      order_idx: item.order_idx,
      order_status: updatedStatus
    })
      .then(res => {
        if (res.data === 'success') {
          alert("주문 상태가 성공적으로 변경되었습니다.");
        } else {
          alert("서버 오류: 상태 변경 실패");
        }
      })
      .catch(err => {
        console.error("상태 변경 실패:", err);
        alert("상태 변경에 실패했습니다.");
      });
  };

  return (
    <div className="order-details-wrapper">
      <h2 className="management-title">주문 상세 관리</h2>

      {orderDetails.map((item, index) => (
        <div key={index} className="order-item">
          <div className="order-info">
            <div><b>주문번호:</b> {item.order_idx}</div>
            <div><b>제품번호:</b> {item.p_idx}</div>
            <div><b>수량:</b> {item.cnt}</div>
            <div>
              <b>주문상태:</b>
              <select
                value={statusList[index]}
                onChange={(e) => handleStatusChange(index, e.target.value)}
              >
                <option value="배송준비중">배송준비중</option>
                <option value="배송중">배송중</option>
                <option value="배송완료">배송완료</option>
              </select>
            </div>
            <button
              className="update-btn"
              onClick={() => handleUpdateClick(index)}
            >
              수정
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
