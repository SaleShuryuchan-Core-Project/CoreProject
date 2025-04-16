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
import Review from "./Review";
import ReviewDetail from "./ReviewDetail";
import Review_Write from "./Review_Write";
import Request from "./RequestPage";
import Request_Write from "./Request_Write";
import RequestDetail from "./RequestDetail";
import PaymentPage from "./PaymentPage";
import PurchasePage from "./PurchasePage"
import ProductManagement from "./ProductManagement";
import ProductAdd from "./ProductAdd";
import OrderDetails from "./OrderDetails";


const MainContainer = ({ setCurrentPage }) => {  // ✅ props 추가
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
    <main className="subMain">
      <header className="mainHeader"> {/* 메인 */}
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
      <div className="scrollable-content">
        <Routes>
          <Route path="/" element={<div>

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
                <a className="bm1" onClick={()=> nav("./review")}><span>리뷰게시판</span></a>
                <a className="bm1" onClick={()=> nav("./request")}><span>요청게시판</span></a>
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
          <Route path="/paymentpage" element={<PaymentPage></PaymentPage>} ></Route>
          <Route path="/review" element={<Review></Review>}></Route>
          <Route path="/review_write" element={<Review_Write></Review_Write>}></Route>
          <Route path="/review/:id" element={<ReviewDetail></ReviewDetail>}></Route>
          <Route path="/request" element={<Request></Request>}></Route>
          <Route path="/request_write" element={<Request_Write></Request_Write>}></Route>
          <Route path="//request/:id" element={<RequestDetail></RequestDetail>}></Route>
          <Route path="/payment" element={<PaymentPage></PaymentPage>}></Route>
          <Route path="/product/:p_idx" element={<PurchasePage></PurchasePage>}></Route>
          <Route path="/productManagement" element={<ProductManagement></ProductManagement>}></Route>
          <Route path="/productAdd" element={<ProductAdd></ProductAdd>}></Route>
          <Route path="/orderdetails" element={<OrderDetails></OrderDetails>}/>

        </Routes>
        <div className="bottom-blank-space"></div>

      </div>
    </main>
  );
};

export default MainContainer;