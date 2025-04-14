// 📁 src/components/Gemini.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import '../css/dd.css';

function GeminiChat({ phoneName: initialPhoneName = '' }) {
  const [phoneName, setPhoneName] = useState(initialPhoneName);
  const [answer, setAnswer] = useState('');
  const [splitSections, setSplitSections] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialPhoneName) return;
    setPhoneName(initialPhoneName);
    handleAsk(initialPhoneName);
  }, [initialPhoneName]);

  const handleAsk = async (queryName) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("phoneName", queryName);

      const response = await axios.post("http://localhost:8083/controller/api/ask", params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        responseType: 'json',
      });

      const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "답변이 없습니다.";
      const html = marked.parse(rawText);
      setAnswer(html);

      const part1 = rawText.split("▶ 1.")[1]?.split("▶ 2.")[0] || '';
      const part2 = rawText.split("▶ 2.")[1]?.split("▶ 3.")[0] || '';
      const part3 = rawText.split("▶ 3.")[1] || '';

      setSplitSections({
        part1: marked.parse(part1),
        part2: marked.parse(part2),
        part3: marked.parse(part3),
      });
      setLoading(false);
    } catch (error) {
      console.error("에러 발생:", error);
      setAnswer("에러 발생!");
      setLoading(false);
    }
  };

  return (
    <div className="gemini-container">
      <h2>📱 예상시세</h2>
  
      {loading && <p className="loading-text">분석 중입니다...</p>}
  
      {!loading && answer && (
        <div className="gemini-section">
          <h3>중고폰 모델 분석</h3>
          {/* 분석 요약 내용만 보여주는 부분 */}
          <div className="answer-container" dangerouslySetInnerHTML={{ __html: answer.split("▶ 1.")[0] }} />
        </div>
      )}
  
      {/* 상세 분석 결과 - 스크롤 영역 추가 */}
      <div className="gemini-scrollbox">
        {!loading && splitSections.part1 && (
          <details className="gemini-details" open>
            <summary>1. 📉 감가사항 분석</summary>
            <div dangerouslySetInnerHTML={{ __html: splitSections.part1 }} />
          </details>
        )}
  
        {!loading && splitSections.part2 && (
          <details className="gemini-details">
            <summary>2. ⚠ 고질적 문제점 분석</summary>
            <div dangerouslySetInnerHTML={{ __html: splitSections.part2 }} />
          </details>
        )}
  
        {!loading && splitSections.part3 && (
          <details className="gemini-details">
            <summary>3. 📌 요약</summary>
            <div dangerouslySetInnerHTML={{ __html: splitSections.part3 }} />
          </details>
        )}
      </div>
  
      {!loading && (
        <div className="warning-box">
          <p className="warning-title">
            ⚠️ 주의: 위 계산은 단순 예시이며, 실제 중고 거래 가격은 시장 상황, 판매자의 희망 가격, 구매자와의 협상 등에 따라 달라질 수 있습니다.
          </p>
          <p className="warning-text">
            중고폰 구매 시에는 여러 판매자의 매물을 비교하고, <strong>직접 상태를 꼼꼼히 확인</strong>하여 합리적인 가격으로 구매하는 것이 중요합니다.
          </p>
        </div>
      )}
    </div>
  );
  
}
  
  export default GeminiChat;