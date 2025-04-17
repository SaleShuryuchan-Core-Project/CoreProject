import React, { useState } from 'react';
import axios from 'axios';
import '../css/customprompt.css';

const CustomPrompt = ({ title, message, onConfirm, onCancel, type }) => {
  const [step, setStep] = useState("input");
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [result, setResult] = useState(null);

  const sendAuthRequest = async () => {
    try {
      if (type === "findId") {
        const res = await axios.post("http://localhost:8083/controller/send-id-auth", {
          email: inputValue
        });
        if (res.data === true) {
          alert("📬 인증번호가 이메일로 전송되었습니다.");
          setStep("code");
        } else {
          alert("❌ 등록되지 않은 이메일입니다.");
        }
      } else if (type === "findPw") {
        const res = await axios.post("http://localhost:8083/controller/send-pw-auth", {
          id: inputValue,
          email: emailValue
        });
        if (res.data === true) {
          alert("📬 인증번호가 이메일로 전송되었습니다.");
          setStep("code");
        } else {
          alert("❌ 입력한 아이디와 이메일이 일치하지 않습니다.");
        }
      }
    } catch (err) {
      alert("⚠️ 인증 요청 중 오류가 발생했습니다.");
    }
  };

  const verifyAuthCode = async () => {
    try {
      if (type === "findId") {
        const res = await axios.post("http://localhost:8083/controller/verify-id-auth", {
          email: inputValue,
          code: authCode
        });
        if (res.data && res.data.userId) {
          setResult(`✅ 인증 성공! 당신의 아이디는 [${res.data.userId}] 입니다.`);
          setStep("done");
        } else {
          alert("❌ 인증번호가 올바르지 않거나 아이디를 찾을 수 없습니다.");
        }
      } else if (type === "findPw") {
        const res = await axios.post("http://localhost:8083/controller/verify-pw-auth", {
          id: inputValue,
          email: emailValue,
          code: authCode
        });
        if (res.data && res.data.password) {
          setResult(`✅ 인증 성공! 비밀번호는 [${res.data.password}] 입니다.`);
          setStep("done");
        } else {
          alert("❌ 인증 실패 또는 비밀번호를 찾을 수 없습니다.");
        }
      }
    } catch (err) {
      alert("⚠️ 인증 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="custom-prompt-overlay">
      <div className="custom-prompt-box">
        <h3>{title}</h3>
        <p>{message}</p>

        {step === "input" && (
          <>
            <input
              type="text"
              placeholder={type === "findId" ? "이메일 입력" : "아이디 입력"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {type === "findPw" && (
              <input
                type="text"
                placeholder="가입 시 이메일 입력"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
            )}
            <div className="custom-prompt-buttons">
              <button className="button-primary" onClick={sendAuthRequest}>인증요청</button>
              <button className="button-secondary" onClick={onCancel}>취소</button>
            </div>
          </>
        )}

        {step === "code" && (
          <>
            <input
              type="text"
              placeholder="인증번호 입력"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
            />
            <div className="custom-prompt-buttons">
              <button className="button-primary" onClick={verifyAuthCode}>확인</button>
              <button className="button-secondary" onClick={onCancel}>취소</button>
            </div>
          </>
        )}

        {step === "done" && (
          <>
            <p className="result-text">{result}</p>
            <div className="custom-prompt-buttons">
              <button className="button-primary" onClick={onCancel}>닫기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomPrompt;