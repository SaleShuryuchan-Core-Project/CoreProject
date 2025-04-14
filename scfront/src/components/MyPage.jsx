import React from "react";
import '../css/mypage.css'; // 아래 CSS 연결

const MyPage = () => {
  return (
    <div className="mypage-container">
      <div className="mypage-main">
        {/* 왼쪽 영역 */}
        <div className="mypage-left">
          <div className="mypage-box">
            <h2>주문 내역</h2>
            <div className="mypage-box-leftcontent">
              주문한 내역이 없습니다.
            </div>
          </div>
          <div className="mypage-box">
            <h2>내가 쓴 글</h2>
            <div className="mypage-box-leftcontent">
              작성한 글이 없습니다.
            </div>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className="mypage-right">
          <div className="mypage-box">
            <div className="mypage-box-header">
              <h2>회원 정보</h2>
              <span className="logout-text">로그아웃</span>
            </div>
            <div className="mypage-form">
              <label>이름</label>
              <input type="text"/>
              <label>휴대폰 번호</label>
              <input type="text" placeholder="-없이 입력" />
              <label>우편번호</label>
              <div className="post-wrap">
                <input type="text"/>
                <button className="search-btn">검색</button>
              </div>
              <label>주소</label>
              <input type="text" placeholder="도로명주소" />
              <input type="text" placeholder="상세주소" />
            </div>
            <div className="mypage-footer">
              <span className="change-password">비밀번호 변경</span>
              <span className="withdraw">회원탈퇴</span>
            </div>
            <div className="save-btn-wrapper">
              <button className="save-btn">변경 사항 저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
