import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/sidepage.css";

import KakaoIcon from "../img/kakao.png";
import GoogleIcon from "../img/google.png";
import NaverIcon from "../img/naver.png";

const SidePage = () => {
  const nav = useNavigate();

  const handleLogin = () => {
    nav("/");
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      <div className="login-box">
        <input type="text" placeholder="아이디" className="login-input" />
        <input type="password" placeholder="비밀번호" className="login-input" />
        <button className="login-btn" onClick={handleLogin}>
          로그인
        </button>

        <div className="login-divider">
          <div className="sns-login-buttons">
            <button className="sns-btn" id="google">
              <img src={GoogleIcon} alt="구글 로그인" />
            </button>
            <button className="sns-btn">
              <img src={KakaoIcon} alt="카카오 로그인" />
            </button>
            <button className="sns-btn">
              <img src={NaverIcon} alt="네이버 로그인" />
            </button>
          </div>
        </div>

        <div className="login-links">
          <span>아이디 찾기</span>
          <span>•</span>
          <span>비밀번호 찾기</span>
        </div>
      </div>

      <div className="signup-box">
        계정이 없으신가요?{" "}
        <span className="signup-link" onClick={() => nav("/join")}>
          가입하기
        </span>
      </div>
    </div>
  );
};

export default SidePage;
