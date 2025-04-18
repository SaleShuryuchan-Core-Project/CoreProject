import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/leftcontainer.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ad1 from "../adimg/스인1.png";
import ad2 from "../adimg/스인2.png";
import ad3 from "../adimg/스인3.png";
import ad4 from "../adimg/스인4.png";

import ad5 from "../adimg/병관쌤.png";
import ad6 from "../adimg/해도쌤.png";

const LeftContainer = () => {
  const nav = useNavigate();

  return (
    <div className="leftContainer">
      {/* 🔍 상단 검색 안내 및 버튼 */}
      <div className="searchView">
        <div className="searchContainer">
          <div className="title">
            <p>
              중고폰 <b>시세!</b> 모르겠어? <b>여기서 확인해!!!</b>
            </p>
            <h2>
              중고폰 판매 사이트 <b>폰 살래 말래</b>
            </h2>
          </div>

          <div className="searchList">
            <a href="/">HOME</a>
            <a href="/pricepage">시세조회</a>
            <a href="/review">리뷰게시판</a>
            <a href="/request">요청하기</a>
          </div>
        </div>
      </div>

      {/* 📢 광고 배너 영역 */}
      <div
        className="adView"
        style={{
          display: "flex",
          flexDirection: "column", // 🔽 세로 정렬
          alignItems: "center", // ➡️ 중앙 정렬
          gap: "25px", // 광고 사이 간격
          marginTop: "30px",
        }}
      >
        {/* 🔁 첫 번째 광고 */}
        <div className="adContainer" style={{ width: "400px" }}>
          <div className="adWrapper">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={5}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              speed={500}
            >
              <SwiperSlide>
                <a href="http://www.smhrd.or.kr" target="_blank" rel="noopener noreferrer">
                  <img src={ad1} alt="ad1" />
                </a>
              </SwiperSlide>
              <SwiperSlide>
                <a href="http://www.smhrd.or.kr" target="_blank" rel="noopener noreferrer">
                  <img src={ad2} alt="ad2" />
                </a>
              </SwiperSlide>
              <SwiperSlide>
                <a href="http://www.smhrd.or.kr" target="_blank" rel="noopener noreferrer">
                  <img src={ad3} alt="ad3" />
                </a>
              </SwiperSlide>
              <SwiperSlide>
                <a href="http://www.smhrd.or.kr" target="_blank" rel="noopener noreferrer">
                  <img src={ad4} alt="ad4" />
                </a>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>

        {/* 🔁 두 번째 광고 */}
        <div className="adContainer" style={{ width: "400px" }}>
          <div className="adWrapper">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={5}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              speed={500}
            >
              <SwiperSlide>
                <a href="https://www.youtube.com/@HodooDady/videos" target="_blank" rel="noopener noreferrer">
                  <img
                    src={ad5}
                    alt="ad1"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </a>
              </SwiperSlide>
              <SwiperSlide>
                <a href="https://www.youtube.com/@%ED%95%B4%EB%8F%84%EA%B8%B4%ED%95%B4%EB%B4%A4%EC%96%B4" target="_blank" rel="noopener noreferrer">
                  <img
                    src={ad6}
                    alt="ad2"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </a>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftContainer;
