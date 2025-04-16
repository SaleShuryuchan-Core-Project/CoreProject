import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/productmanagement.css'; // 제품관리페이지에 맞는 CSS 파일
import { useNavigate } from 'react-router-dom';

const ProductManagementPage = () => {
  // 스프링에서 받은 제품 데이터를 저장할 상태 (초기값: 빈 배열)
  const [products, setProducts] = useState([]);
  // 체크한 제품 id를 저장하는 상태
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  // 전체 선택 상태 (true/false)
  const [checkAll, setCheckAll] = useState(false);

  // 컴포넌트 마운트 시 스프링 백엔드에서 제품 데이터를 가져옴
  useEffect(() => {
    axios.post("http://localhost:8083/controller/recommend")
      .then(response => {
        console.log("Fetched products: ", response.data);
        setProducts(response.data);
      })
      .catch(error => {
        console.error("상품로딩 실패: ", error);
      });
  }, []);

  // 전체 체크박스 선택/해제 함수
  const handleCheckAll = () => {
    if (checkAll) {
      setSelectedProductIds([]);
    } else {
      // 스프링에서 전달받은 제품 객체의 고유값은 p_idx
      setSelectedProductIds(products.map(product => product.p_idx));
    }
    setCheckAll(!checkAll);
  };

  // 개별 제품 체크박스 선택 함수
  const handleProductCheck = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(productId => productId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  // 선택된 제품 삭제 함수 (클라이언트 상태 업데이트; 실제 삭제는 추가 API 연동 필요)
  const handleDeleteSelected = () => {
    const remainingProducts = products.filter(product => !selectedProductIds.includes(product.p_idx));
    setProducts(remainingProducts);            // 삭제 반영
    setSelectedProductIds([]);                 // 체크 초기화
    setCheckAll(false);                        // 전체 선택 해제
  };

  // 제품 수정 함수 (예시: 제품 이름 수정)
  const handleEditProduct = (id) => {
    const productToEdit = products.find(product => product.p_idx === id);
    const newName = prompt("수정할 제품명을 입력하세요", productToEdit.p_name);
    if (newName && newName.trim() !== "") {
      const updatedProducts = products.map(product =>
        product.p_idx === id ? { ...product, p_name: newName } : product
      );
      setProducts(updatedProducts);
    }
  };

  const nav = useNavigate();

  return (
    <div className="product-management-wrapper">
      <h2 className="management-title">제품 관리</h2>
      <div className="management-header">
        <div className="management-header-left">
          <input 
            type="checkbox" 
            checked={checkAll} 
            onChange={handleCheckAll} 
          /> 
          <span>전체선택</span>
        </div>
        <div className="management-header-buttons">
          <button className="delete-btn" onClick={handleDeleteSelected}>
            선택상품 삭제
          </button>
          <button className="add-btn" onClick={() => nav("/ProductAdd")}>
            제품 추가
          </button>
        </div>
      </div>

      {products.map((product) => (
        <div key={product.p_idx} className="product-item">
          <input 
            type="checkbox" 
            checked={selectedProductIds.includes(product.p_idx)} 
            onChange={() => handleProductCheck(product.p_idx)} 
          />
          {/* Spring 서버에서 제공하는 이미지를 출력 */}
          <img 
            src={product.p_img1} 
            alt="product" 
            width="100" 
          />
          <div className="product-info">
            <div className="product-name">{product.p_name}</div>
            <div className="product-price">{product.price.toLocaleString()}원</div>
          </div>
          <div className="product-actions">
            <button 
              className="edit-btn" 
              onClick={() => handleEditProduct(product.p_idx)}
            >
              수정
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductManagementPage;
