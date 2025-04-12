import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PriceCheck from "./PriceCheck";
import "../css/maincontainer.css";
import Menu from "../img/menu.png";
import Close from "../img/close.png";
import Login from "./SidePage";
import mainImage from "../img/gpt.png";

const MainContain = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isPriceCheck, setIsPriceCheck] = useState(false);
  const nav = useNavigate();

  const toggleMenu = () => {
    setVisible(true);
    setTimeout(() => setMenuOpen(true), 10);
  };

  const closeMenuAndGoHome = () => {
    setMenuOpen(false);
    setTimeout(() => setVisible(false), 300);
  };

  const openPriceCheck = () => {
    setIsPriceCheck(true);
  };

  const closePriceCheck = () => {
    setIsPriceCheck(false);
  };

  return (
    <div className="subMain">
      <header className="mainHeader">
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
          <Login />
        </div>
      )}

      <div id="MainPage">
        {/* PriceCheck 오버레이 */}
        {isPriceCheck && (
          <div className="priceCheckOverlay">
            <PriceCheck onClose={closePriceCheck} />
          </div>
        )}

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
            <p></p>
            <img src={mainImage} className="mainImage" alt="메인" />
          </div>
        </section>
        <section className="mainSection1">
          <div className="innerSection">
            <a
              className="bm1"
              onClick={openPriceCheck}
              style={{ cursor: "pointer" }}
            >
              <span>시세조회</span>
            </a>
            <a className="bm1">
              <span>ATM</span>
            </a>
            <a className="bm1">
              <span>이용방법</span>
            </a>
          </div>
        </section>
        <section>
          <div className="inner">
            <div>
              <img src={mainImage} className="mainImage" alt="메인" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainContain;