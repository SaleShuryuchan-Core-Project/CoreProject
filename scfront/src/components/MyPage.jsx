import React, { useState, useRef, useEffect } from "react";
import axios, { formToJSON } from "axios";
import { useNavigate } from "react-router-dom";
import logoutImg from "../img/logout.gif";
import '../css/mypage.css'; // 아래 CSS 연결

const MyPage = () => {
  const nav = useNavigate();
  const addressString = JSON.parse(localStorage.getItem('userInfo')).addr;
  const [zipcode, road, jibun, detail] = addressString.split("_");        // _ 별로 나눔 

  const [orderInfo, setOrderInfo] = useState(false); // 주문 정보가 있냐 없냐
  const [reqInfo, setReqInfo] = useState(false); // 요청 있냐 없냐..?
  const [revInfo, setRevInfo] = useState(false); // 리뷰 있냐 없냐..?

  const userInfo = JSON.parse(localStorage.getItem('userInfo')); // JSON 파일형태가 되어야 객체가 인식됨

  const [formData, setFormData] = useState({ // 정보 저장
    id: userInfo.u_id,
    pw: userInfo.pw,
    name: userInfo.name,
    nickname: userInfo.nick,
    phone: userInfo.phone,
    email: userInfo.email,
    zipcode1: zipcode,
    zipcode2: road,
    address: jibun,
    detailAddress: detail,
  });
  const [isEditable, setIsEditable] = useState(false);  // 수정 가능할지 안할지 

  const postcodeRef = useRef(null);
  const roadAddressRef = useRef(null);
  const jibunAddressRef = useRef(null);
  const detailAddressRef = useRef(null);
  const extraAddressRef = useRef(null);
  const guideRef = useRef(null);

  const [order, setOrder] = useState([]);
  const [req, setReq] = useState([]);
  const [rev, setRev] = useState([]);

  useEffect(() => { // 주문 내역 불러오기
    axios.post("http://localhost:8083/controller/mypageorder",
      { u_id: userInfo.u_id })
      .then((res) => {
        console.log(res.data);
        if (res.data != "") {
          setOrder(res.data);
          setOrderInfo(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => { // 요청 내역 불러오기
    axios.post("http://localhost:8083/controller/mypageReq",
      { u_id: userInfo.u_id })
      .then(res => {
        console.log(res.data);
        if (res.data != "") {
          setReq(res.data);
          setReqInfo(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => { // 리뷰  내역 불러오기
    axios.post("http://localhost:8083/controller/mypageRev",
      { u_id: userInfo.u_id })
      .then(res => {
        console.log(res.data);
        if (res.data != "") {
          setRev(res.data);
          setRevInfo(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {  // Daum Postcode 스크립트를 동적으로 로드 (이미 로드되어 있다면 건너뜀)
    if (!window.daum || !window.daum.Postcode) {
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const sample4_execDaumPostcode = () => { // 우편번호 찾기 함수 실행
    if (!isEditable) return;
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const roadAddr = data.roadAddress;
          let extraRoadAddr = "";

          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraRoadAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraRoadAddr += (extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName);
          }
          if (extraRoadAddr !== "") {
            extraRoadAddr = " (" + extraRoadAddr + ")";
          }

          const zonecode = data.zonecode;
          const jibun = data.jibunAddress;
          const detail = detailAddressRef.current?.value || ""; // 상세주소는 기존값 유지

          // 입력창에 값 넣기
          if (postcodeRef.current) postcodeRef.current.value = zonecode;
          if (roadAddressRef.current) roadAddressRef.current.value = jibun;
          if (jibunAddressRef.current) jibunAddressRef.current.value = detail;
          if (extraAddressRef.current) {
            extraAddressRef.current.value = roadAddr !== "" ? extraRoadAddr : "";
          }

          // 📌 React state에도 값 반영

          setFormData(prev => ({
            ...prev,
            zipcode1: zonecode,
            zipcode2: roadAddr,
            address: jibun,
            detailAddress: detail,
          }));

          // 예상 주소 안내 텍스트 처리
          if (guideRef.current) {
            if (data.autoRoadAddress) {
              const expRoadAddr = data.autoRoadAddress + extraRoadAddr;
              guideRef.current.innerHTML = `(예상 도로명 주소 : ${expRoadAddr})`;
              guideRef.current.style.display = "block";
            } else if (data.autoJibunAddress) {
              const expJibunAddr = data.autoJibunAddress;
              guideRef.current.innerHTML = `(예상 지번 주소 : ${expJibunAddr})`;
              guideRef.current.style.display = "block";
            } else {
              guideRef.current.innerHTML = "";
              guideRef.current.style.display = "none";
            }
          }
        },
      }).open();
    } else {
      console.error("Daum Postcode SDK가 로드되지 않았습니다.");
    }
  };

  const handleChange = (e) => { // 바뀐 값 저장
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const update = () => { // 변경 사항 저장
    axios.post("http://localhost:8083/controller/update", formData)
      .then(res => {
        if (res.data != "") {
          alert("정보 수정 완료");

          const userObj = res.data;

          localStorage.setItem("userInfo", JSON.stringify(userObj)); // 새롭게 업데이트 

        } else {
          alert("아이디나 비밀번호가 일치하지 않습니다.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("저장 중 오류가 발생했습니다.");
      });
      setIsEditable(false);
  };

  const check = () => { // 중복 체크
    if (!isEditable) return;
    axios.post("http://localhost:8083/controller/check", {
      nickname: formData.nickname
    })
      .then((res) => {
        if (res.data === 1) {
          alert("사용가능합니다.");
        } else {
          alert("중복되었습니다.");
        }

      })
  };

  const userDelete = () => { // 회원탈퇴
    let Real = window.confirm("정말로 삭제하시겠습니까?");
    if (Real) {
      let real = window.prompt("정말로 삭제하신다면 비밀번호를 입력해주세요", "");
      if (real === userInfo.pw) {
        axios.post("http://localhost:8083/controller/delete", formData)
          .then(res => {
            if (res.data == 1) {
              alert("회원탈퇴가 진행되었습니다");
              if (userInfo.u_role === "kakao") {
                const popup = window.open("", "kakaoLogout", "width=360,height=240,left=600,top=300");
                if (!popup) {
                  alert("팝업이 차단되었습니다. 브라우저 팝업 설정을 확인해주세요.");
                  return;
                }
                popup.document.write(`
                    <html>
                      <head>
                        <title>로그아웃 중</title>
                        <style>
                          body {
                            font-family: 'Noto Sans KR', sans-serif;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #fffbe7;
                            color: #333;
                          }
                          img {
                            width: 80px;
                            height: 80px;
                            margin-bottom: 16px;
                          }
                          .message {
                            font-size: 16px;
                            font-weight: 500;
                          }
                          iframe {
                            display: none;
                          }
                        </style>
                      </head>
                      <body>
                        <img src="${logoutImg}" alt="로그아웃 중" />
                        <div class="message">카카오에서 안전하게<br>탈퇴중이에요 다음에봐요 🍯🐝</div>
                        <iframe src="https://accounts.kakao.com/logout?continue=https://kauth.kakao.com/oauth/logout"></iframe>
                      </body>
                    </html>
                  `);

                // 팝업 닫기 (2초 후)
                setTimeout(() => {
                  try {
                    popup.close();
                  } catch (e) {
                    console.warn("팝업 닫기 실패:", e);
                  }
                }, 2000);

                // 카카오 관련 데이터 모두 삭제
                window.Kakao.Auth.setAccessToken(undefined);
                localStorage.removeItem("kakaoUser");
                alert("로그아웃 되었습니다!");
              }
              localStorage.removeItem("userInfo");

              nav("/");
            } else {
              alert("오류로 인해 해당 요청을 실행하지 못했습니다. 잠시후 시도해주세요");
            }
          })
          .catch((err) => {
            console.error(err);
            alert("오류로 인해 해당 요청을 실행하지 못했습니다. 잠시후 시도해주세요");
          })
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } else {
      alert("취소되었습니다.");
    }
  };

  const pwChange = () => { // 비밀번호 변경
    let nowp = window.prompt("현재 비밀번호를 입력해주세요", "");
    if (nowp === userInfo.pw) {
      let newp = window.prompt("새롭게 변경하실 비밀번호를 입력해주세요", "");
      let newpc = window.prompt("변경하신 비밀번호를 한번더 입력해주세요.", "");
      if (newp === newpc) {
        axios.post("http://localhost:8083/controller/pwchange",
          {
            id: userInfo.u_id,
            pw: newp
          })
          .then(res => {
            alert("수정 되었습니다!");
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));

            userInfo.pw = newp;

            localStorage.setItem('userInfo', JSON.stringify(userInfo));
          })
          .catch((err) => {
            console.error(err);
          })
      }
    }
  };

  return (
    <div className="mypage-container">
      <div className="mypage-main">
        {/* 왼쪽 영역 */}
        <div className="mypage-left">
          <div className="mypage-box">
            <h2>주문 내역</h2>
            <div className="mypage-box-leftcontent">
              {!orderInfo ? "주문내역이 없습니다" : (
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>제품명</th>
                      <th>총 결제금액</th>
                      <th>결제수단</th>
                      <th>배송 상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.map((item, index) => (
                      <tr key={index}>
                        <td>{item.p_name}</td>
                        <td>{item.pay_amount}원</td>
                        <td>{item.pay_method}</td>
                        <td>{item.order_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              )}
            </div>
          </div>
          <div className="mypage-box">
            <h2>내가 쓴 글</h2>
            <div className="mypage-box-leftcontent">

              {/* 요청글 */}
              {reqInfo && req.length > 0 && (
                <>
                  <h3 className="table-label">📦 제품 요청</h3>
                  <div className="card-list">
                    {req.map((item, index) => (
                      <div
                        className="card-row"
                        key={index}
                        onClick={() => nav(`/request/${item.req_idx}`)} // 네가 원하는 경로로 수정
                      >
                        <span className="card-title">{item.req_title}</span>
                        <span className="card-date">{item.created_at}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* 리뷰글 */}
              {revInfo && rev.length > 0 && (
                <>
                  <h3 className="table-label">📝 리뷰</h3>
                  <div className="card-list">
                    {rev.map((item, index) => (
                      <div
                        className="card-row"
                        key={index}
                        onClick={() => nav(`/review/${item.review_idx}`)} // 네가 원하는 경로로 수정
                      >
                        <span className="card-content">{item.review_content}</span>
                        <span className="card-rating">⭐ {item.review_ratings}</span>
                        <span className="card-date">{item.created_at}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!reqInfo && !revInfo && (
                <p>작성한 글이 없습니다.</p>
              )}

            </div>

          </div>

        </div>

        {/* 오른쪽 영역 */}
        <div className="mypage-right">
          <div className="mypage-box">
            <div className="mypage-box-header">
              <h2>회원 정보</h2>
              <span className="logout-text" onClick={() => nav("/")}>돌아가기</span>
            </div>
            <div className="mypage-form">
              <label>이름</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
              <label>닉네임</label>
              <div className="input-with-btn">
                <input
                  type="text"
                  className="form-input"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  readOnly={!isEditable}
                />
                <button className="search-btn" onClick={check}>중복확인</button>
              </div>

              <label>휴대폰 번호</label>
              <input type="text" className="form-input" name="phone" value={formData.phone} readOnly={!isEditable} onChange={handleChange} />
              <label>주소</label>
              <div className="input-with-btn">
                <input
                  className="form-input"
                  type="text"
                  id="sample4_postcode"
                  name="zipcode1"
                  onChange={handleChange}
                  readOnly={!isEditable}
                  ref={postcodeRef}
                  value={formData.zipcode1}
                />
                <button
                  className="search-btn"
                  onClick={sample4_execDaumPostcode}
                  disabled={!isEditable}
                >
                  우편번호 찾기
                </button>
              </div>


              <div className="form-group">
                <input className="form-input"
                  type="text"
                  id="sample4_roadAddress"
                  name="zipcode2"
                  onChange={handleChange}
                  readOnly={!isEditable}
                  ref={roadAddressRef}
                  value={formData.zipcode2}
                />
              </div>
              <div className="form-group">
                <input className="form-input"
                  type="text"
                  id="sample4_jibunAddress"
                  name="address"
                  onChange={handleChange}
                  readOnly={!isEditable}
                  ref={jibunAddressRef}
                  value={formData.address}
                />
              </div>
              <div className="form-group">
                <span className="form-input"
                  id="guide"
                  ref={guideRef}
                  style={{ color: "#999", display: "none" }}
                ></span>
                <input className="form-input"
                  type="text"
                  id="sample4_detailAddress"
                  name="detailAddress"
                  onChange={handleChange}
                  readOnly={!isEditable}
                  ref={detailAddressRef}
                  value={formData.detailAddress} />
              </div>
            </div>
            <div className="mypage-footer">
              <span className="change-password" onClick={pwChange}>비밀번호 변경</span>
              <span className="withdraw" onClick={userDelete}>회원탈퇴</span>
            </div>
            <div className="save-btn-wrapper">
              {!isEditable ? (
                <button className="save-btn" onClick={() => setIsEditable(true)}>수정하기</button>
              ) : (
                <button className="save-btn" onClick={update}>변경 사항 저장</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;