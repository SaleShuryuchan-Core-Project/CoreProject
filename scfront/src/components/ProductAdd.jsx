import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/productadd.css";

const AddProductPage = () => {
  const nav = useNavigate();


  // public/img 폴더 내 이미지 파일 목록 (배열로 관리)
  const imgList = [
    "폰1.jpg",
    "폰2.jpg",
    "폰3.jpg",
    "apple.png",
    "kakao.png",
    "lg.png",
  ];

  // 선택된 이미지 상태
  const [selectedImgs, setSelectedImgs] = useState({
    p_img1: "",
    p_img2: "",
    p_img3: "",
  });

  // 이미지 선택 함수
  const handleImageSelect = (img, index) => {
    if (index === 1) {
      setSelectedImgs((prev) => ({
        ...prev,
        p_img1: img,
      }));
    } else if (index === 2) {
      setSelectedImgs((prev) => ({
        ...prev,
        p_img2: img,
      }));
    } else if (index === 3) {
      setSelectedImgs((prev) => ({
        ...prev,
        p_img3: img,
      }));
    }
  };

  const [info, setInfo] = useState({
    p_name: "",
    price: "",
    p_status: "",
    p_ownership: "",
    p_img1: "",  // 이미지 경로만 저장
    p_img2: "",
    p_img3: "",
  });

  // input 값 변경 시 호출
  const handleChange = (e) => { // 회원가입 입력시 저장하는 함수
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    const productData = {
      p_name: info.p_name,
      price: info.price,
      p_status: info.p_status,
      p_ownership: info.p_ownership,
      p_img1: selectedImgs.p_img1, // 경로만 저장
      p_img2: selectedImgs.p_img2,
      p_img3: selectedImgs.p_img3,
    };

    axios
.post("http://localhost:8083/api/product/add", productData)
      .then((res) => {
        alert("제품이 등록되었습니다!");
        nav("/ProductManagement");
      })
      .catch((err) => {
        console.error("전송 에러:", err);
        alert("등록 중 오류 발생!");
      });
  };

  return (
    <div className="productadd-management-wrapper">
      <h2 className="addmanagement-title">제품 추가</h2>
      <div className="add-product-form">
        <div className="form-group">
          <label>제품명:</label>
          <input
            type="text"
            name="p_name"
            onChange={handleChange}
            value={info.p_name}
          />
        </div>
        <div className="form-group">
          <label>가격:</label>
          <input
            type="number"
            name="price"
            onChange={handleChange}
            value={info.price}
          />
        </div>
        <div className="form-group">
          <label>제품 상태:</label>
          <textarea
            name="p_status"
            onChange={handleChange}
            value={info.p_status}
          />
        </div>

        <div className="form-group">
          <label>제품 이미지 선택 (최대 3개):</label>
          <div className="image-selection">
            {imgList.map((img, idx) => (
              <div key={idx} className="image-item" style={{ display: "inline-block", margin: "10px" }}>
                <img
                  src={`/img/${img}`} // public/img 폴더 내 이미지 참조
                  alt={img}
                  width="100"
                  style={{
                    cursor: "pointer",
                    border: selectedImgs.p_img1 === img || selectedImgs.p_img2 === img || selectedImgs.p_img3 === img
                      ? "3px solid blue"
                      : "none", // 선택된 이미지는 파란 테두리
                  }}
                  onClick={() => handleImageSelect(img, idx + 1)} // 선택된 이미지 번호 전달
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>보유 상태:</label>
          <input
            type="number"
            name="p_ownership"
            onChange={handleChange}
            value={info.p_ownership}
          />
        </div>

        <button type="submit" className="productadd-btn" onClick={handleSubmit}>
          추가하기
        </button>
      </div>
    </div>
  );
};

export default AddProductPage;
