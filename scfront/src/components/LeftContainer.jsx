import React from 'react';
import { useNavigate } from "react-router-dom";
import pu from '../img/pu.png';
import "../css/leftcontainer.css"; 

const LeftContainer = () => {
  const nav = useNavigate();

  return (
    <div className='leftContainer'>
      <div className='searchView'>
        <div className='searchContainer'>
          <div className='title'>
            <p>
              중고폰 <b>시세!</b> 모르겠어? <b>여기서 확인해!!!</b>
            </p>
            <h2>
              중고폰 판매 사이트 <b>폰 살래 말래</b>
            </h2>
          </div>

          <div className='searchList'>
            <a href="">HOME</a>
            <a href="">시세조회</a>
            <a href="">리뷰게시판</a>
            <a href="">요청하기</a>
          </div>
        </div>
      </div>

      <div className='adView'>
        <div className='adContainer'>
          <div className='adWrapper' style={{ transitionDuration: "300ms", transform: "translate3d(-650px, 0px, 0px)" }}>
            <div className='adSlide1' data-swiper-slide-index="0">
              <a
                href="http://www.smhrd.or.kr"
                // target="_blank"
                // rel="noopener noreferrer"
              >
                SMHRD 홈페이지
              </a>
            </div>
          </div>

          <div className='pageContainer'>
            <div className='pager'>
              <div className='pageSwiper'>
                <span className='swiperCurrent'>1</span> /
                <span className='swiperTotal'>2</span>
              </div>
            </div>

            <div className='allBtn'>
              <a href="#">
                <img src={pu} alt="전체보기" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftContainer;
