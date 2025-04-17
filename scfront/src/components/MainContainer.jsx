import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import "../css/maincontainer.css";
import Menu from "../img/menu.png";
import Close from "../img/close.png";
import Login from "./SidePage"; // SidePage 컴포넌트
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
import PurchasePage from "./PurchasePage";
import ProductManagement from "./ProductManagement";
import ProductAdd from "./ProductAdd";
import OrderDetails from "./OrderDetails";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ad7 from "../adimg/1.png";
import ad8 from "../adimg/2.jpg";
import ad9 from "../adimg/3.png";

const MainContainer = ({ setCurrentPage }) => {
  // ✅ props 추가
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isPriceCheck, setIsPriceCheck] = useState(false);
  const nav = useNavigate();

  //로그인 함수 전역으로 처리
  const openLoginSidePage = () => {
    setVisible(true);
    setTimeout(() => setMenuOpen(true), 10);
  };
  const closeLoginSidePage = () => {
    setMenuOpen(false);
    setTimeout(() => setVisible(false), 300);
  };

  // 테스트
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8083/controller/api/notification/check")
      .then((res) => {
        if (res.data.hasNew) {
          setMessage(res.data.message || "새로운 알림이 도착했습니다.");
          setShowNotification(true);
        }
      })
      .catch((err) => {
        console.error("🔴 알림 API 호출 실패", err);
      });
  }, []);

  // 여기까지만 사용할거

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
      <header className="mainHeader">
        {" "}
        {/* 메인 */}
        <div className="subHeaderWrapper">
          <button onClick={toggleMenu} className="headerMenu">
            <div className="menu-icon-container">
              {/* <img src={Menu} alt="Menu" className="menu-icon" /> */}
              <img src={Menu} alt="menu" width="36px" />
            </div>
          </button>
          {/* {showNotification && (
            <div className="notification-popup">
              <div className="notification-content">
                <span className="notification-icon">🔔</span>
                <span className="notification-text">요청하신 글에 답변이 등록되었습니다!</span>
              </div>
              <button className="notification-close" onClick={() => setShowNotification(false)}>X</button>
            </div>
          )} */}
        </div>
      </header>
      {visible && (
        <div className={`sideMenu ${menuOpen ? "open" : ""}`}>
          <div className="closeButton">
            <button onClick={closeMenuAndGoHome}>
              <img src={Close} alt="close" width="36px" />
            </button>
          </div>
          <Login
            setCurrentPage={setCurrentPage}
            closeMenu={closeLoginSidePage}
          />{" "}
          {/* ✅ props 전달 */}
        </div>
      )}
      <div className="scrollable-content">
        <Routes>
          <Route
            path="/"
            element={
              <div>
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
                      <div className="adContainer" style={{ width: "200px", backgroundColor : "#fff" }}>
                        <div className="adWrapper">
                          <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={5}
                            slidesPerView={1}
                            autoplay={{
                              delay: 3000,
                              disableOnInteraction: false,
                            }}
                            speed={500}
                          >
                            <SwiperSlide>
                              <img
                                src={ad7}
                                alt="ad1"
                                style={{ maxWidth: "100%", height: "auto" }}
                              />
                            </SwiperSlide>
                            <SwiperSlide>
                              <img
                                src={ad8}
                                alt="ad2"
                                style={{ maxWidth: "100%", height: "auto" }}
                              />
                            </SwiperSlide>
                            <SwiperSlide>
                              <img
                                src={ad9}
                                alt="ad2"
                                style={{ maxWidth: "100%", height: "auto" }}
                              />
                            </SwiperSlide>
                          </Swiper>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <section className="mainSection1">
                  <div className="innerSection">
                    <a className="bm1" onClick={() => nav("/pricepage")}>
                      <span>시세조회</span>
                    </a>
                    <a className="bm1" onClick={() => nav("./review")}>
                      <span>리뷰게시판</span>
                    </a>
                    <a className="bm1" onClick={() => nav("./request")}>
                      <span>요청게시판</span>
                    </a>
                  </div>
                </section>
              </div>
            }
          ></Route>{" "}
          {/* 메인끝 */}
          <Route path="/mypage" element={<MyPage></MyPage>}></Route>
          <Route path="/cartpage" element={<CartPage></CartPage>}></Route>
          <Route path="/pricepage" element={<PriceCheck></PriceCheck>}></Route>
          <Route
            path="/review"
            element={<Review openLoginSidePage={openLoginSidePage}></Review>}
          ></Route>
          <Route
            path="/review_write"
            element={<Review_Write></Review_Write>}
          ></Route>
          <Route
            path="/review/:id"
            element={<ReviewDetail></ReviewDetail>}
          ></Route>
          <Route
            path="/request"
            element={<Request openLoginSidePage={openLoginSidePage}></Request>}
          ></Route>
          <Route
            path="/request_write"
            element={<Request_Write></Request_Write>}
          ></Route>
          <Route
            path="/request/:id"
            element={<RequestDetail></RequestDetail>}
          ></Route>
          <Route path="/payment" element={<PaymentPage></PaymentPage>}></Route>
          <Route
            path="/product/:p_idx"
            element={
              <PurchasePage
                openLoginSidePage={openLoginSidePage}
              ></PurchasePage>
            }
          ></Route>
          <Route
            path="/productManagement"
            element={<ProductManagement></ProductManagement>}
          ></Route>
          <Route path="/productAdd" element={<ProductAdd></ProductAdd>}></Route>
          <Route path="/orderdetails" element={<OrderDetails></OrderDetails>} />
        </Routes>
        <div className="bottom-blank-space"></div>
      </div>
    </main>
  );
};

export default MainContainer;
