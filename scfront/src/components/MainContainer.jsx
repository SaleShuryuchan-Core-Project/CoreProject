import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import "../css/maincontainer.css";
import Menu from "../img/menu.png";
import Close from "../img/close.png";
import Login from "./SidePage";  // SidePage 컴포넌트
import mainImage from "../img/gpt.png";
import MyPage from "./MyPage";
import CartPage from "./CartPage";
import PriceCheck from "./PriceCheck";

const MainContainer = ({ setCurrentPage }) => {  // ✅ props 추가
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const nav = useNavigate();

  const toggleMenu = () => {
    setVisible(true);
    setTimeout(() => setMenuOpen(true), 10);
  };

  const closeMenuAndGoHome = () => {
    console.log("X 버튼이 클릭되었습니다!");
    setMenuOpen(false);
    setTimeout(() => setVisible(false), 300);
  };

  return (
    <main className="subMain">
      <Routes>
        <Route path="/" element={<div><header className="mainHeader"> {/* 메인 */}
          <div className="subHeaderWrapper">
            <button onClick={toggleMenu} className="headerMenu">
              <img src={Menu} alt="menu" width="36px" />
            </button>
          </div>
        </header>

          {visible && (
            <div className={`sideMenu ${menuOpen ? "open" : ""}`}>
              <div className="closeButton">
                <button onClick={closeMenuAndGoHome}>
                  <img src={Close} alt="close" width="36px" />
                </button>
              </div>
              <Login setCurrentPage={setCurrentPage} /> {/* ✅ props 전달 */}
            </div>
          )}

          <div id="MainPage">
            <section className="mainVisual">
              <div className="inner">
                <h1 style={{ textAlign: "center" }}>
                  <br />
                  <b>중고폰, 지금 얼마일까?</b>
                  <br />
                  궁금한 중고폰 시세,
                  <br />
                  브랜드부터 모델, 용량까지
                  <br />
                  클릭 몇 번이면 확인 끝!
                  <br />
                </h1>
                <img src={mainImage} className="mainImage" alt="main" />
              </div>
            </section>
          </div>

          <section className="mainSection1">
            <div className="innerSection">
              <a className="bm1" onClick={() => nav("/pricepage")}><span>시세조회</span></a>
              <a className="bm1"><span>ATM</span></a>
              <a className="bm1"><span>이용방법</span></a>
            </div>
          </section>

          <section>
            <div className="inner">
              <div>
                <img src={mainImage} className="mainImage" alt="main" />
              </div>
            </div>
          </section>
        </div>}>
        </Route> {/* 메인끝 */}
        <Route path="/mypage" element={<MyPage></MyPage>}></Route>
        <Route path="/cartpage" element={<CartPage></CartPage>}></Route>
        <Route path="/pricepage" element={<PriceCheck></PriceCheck>} ></Route>
        
      </Routes>
    </main>
  );
};

export default MainContainer;
