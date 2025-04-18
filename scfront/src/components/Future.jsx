import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import '../css/future.css';

const Future = ({ modelName, capacity, color, 기변상태 }) => {
  const [yearsLater, setYearsLater] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [parsedCurrentPrice, setParsedCurrentPrice] = useState('');
  const [parsedFuturePrice, setParsedFuturePrice] = useState('');
  const [currentHTML, setCurrentHTML] = useState('');
  const [futureHTML, setFutureHTML] = useState('');

  const detail = useMemo(() => ({
    상태: '중',
    구성품: '풀패키징',
    기변: 기변상태 || '확정기변',
    약정: '요금할인',
    보증: '기간종료'
  }), [기변상태]);

  // const extractPrice = (text) => {
  //   const match = text.match(/예상 중고가는 약\s*([\d,]+)\s*원\s*~\s*([\d,]+)\s*원/);
  //   return match ? `${match[1]}원 ~ ${match[2]}원` : '분석 실패';
  // };

  const extractPrice = (text) => {
    const match = text.match(/([0-9,]+)\s*원\s*~\s*([0-9,]+)\s*원/);
    return match ? `${match[1]}원 ~ ${match[2]}원` : '분석 실패';
  };

  const fullModelName = [modelName, capacity, color].filter(Boolean).join(' ');

  const handleCurrentPrice = useCallback(async () => {
    const prompt = `
  너는 중고폰 전문 평가자야. 아래 모델의 중고폰 시세 분석 보고서를 작성해줘.
  
  모델명: "${fullModelName}"
  
  ⛔ 아래 지침을 꼭 지켜:
  - 서론/설명 없이 분석 내용부터 바로 시작 (예: '알겠습니다' 같은 문구 금지)
  - 무조건 마크다운 테이블 |로 작성해 (탭이나 스페이스 정렬 ❌)
  - 테이블은 **헤더 포함**해서 아래 구조를 따라야 해:
  
  ▶ 평균 중고 시세:
  - 예: **${fullModelName}**의 평균 중고가는 약 450,000원 ~ 550,000원입니다.
  
  ▶ 1. 감가사항 분석:
  | 항목 | 상세 원인 | 감가액 |
  |------|-----------|--------|
  | 배터리 성능 저하 | 효율 90% 이하 | -30,000 ~ -50,000원 |
  (위 형식으로 최소 8개 이상)
  
  ▶ 2. 고질적인 문제점 분석:
  | 카테고리 | 문제점 | 상세 설명 | 중고가 영향 |
  |----------|--------|------------|----------------|
  | 하드웨어 | 배터리 저하 | 2년 경과 후 성능 하락 | 중고가 -10% 반영 |
  (위 형식으로 최소 4개 이상)
  
  ▶ 3. 요약:
  - 위 내용을 5줄 이내 요약
  
  ※ 출력은 반드시 | 마크다운 표로만! HTML 태그, <details> <summary> 등 금지
    `;
  
    const params = new URLSearchParams();
    params.append("question", prompt);
  
    try {
      const res = await axios.post("http://localhost:8083/controller/api/future", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      });
  
      const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '분석 실패';
      setParsedCurrentPrice(extractPrice(text));
      setCurrentHTML(marked.parse(text));
    } catch (err) {
      console.error("현재 시세 분석 실패:", err);
      setParsedCurrentPrice("분석 실패");
      setCurrentHTML("<p>분석 실패</p>");
    }
  }, [fullModelName]);
  

  //  향후 시세 분석 요청
  const handleFuturePrice = async () => {
    const prompt = `
이 중고폰을 현재 기준으로 ${yearsLater}년(예: 2025년 → ${2025 + yearsLater}년) 뒤에 되팔 경우 예상되는 시세를 분석해줘.

[1] 각 항목이 시세에 미치는 영향과 함께 마크다운 표로 정리해줘 (항목 | 영향 | 상승/하락 요인 설명)
[2] 분석 요약을 구체적이고 간결하게 문단으로 정리해줘.
[3] 마지막에 반드시 아래 문장 형식을 지켜줘:
"**이 핸드폰의 ${yearsLater}년 뒤 예상 중고가는 약 000,000원 ~ 000,000원입니다.**"

모델 정보:
- 모델명: ${fullModelName}
- 제품상태: ${detail.상태}
- 구성품: ${detail.구성품}
- 기변상태: ${detail.기변}
- 선택약정: ${detail.약정}
- 보증기간: ${detail.보증}
    `;

    const params = new URLSearchParams();
    params.append("question", prompt);

    const res = await axios.post("http://localhost:8083/controller/api/future", params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    });

    const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '분석 실패';
    setParsedFuturePrice(extractPrice(text));
    setFutureHTML(marked.parse(text));
    setShowDetail(true);
  };

  useEffect(() => {
    if (modelName) {
      handleCurrentPrice();
    }
  }, [modelName, capacity, color, 기변상태, handleCurrentPrice]);

  return (
    <div className="future-wrapper">
      <h2 className="future-title">📱 현재 중고 시세 분석</h2>
      {parsedCurrentPrice && (
        <div className="future-result">
          o(*￣▽￣*)ブ 현재 예상 중고가는 <strong>{parsedCurrentPrice}</strong>입니다.
        </div>
      )}

      <hr className="future-divider" />

      <h2 className="future-title">🕒 향후 시세 예측</h2>
      <div className="future-input-row">
        <input
          type="number"
          placeholder="몇 년 뒤?"
          value={yearsLater}
          onChange={(e) => setYearsLater(e.target.value)}
        />
        <button onClick={handleFuturePrice} disabled={!yearsLater}>예상 시세 예측</button>
      </div>

      {parsedFuturePrice && (
        <div className="future-result future">
          📉 {yearsLater}년 뒤 예상 시세는 <strong>{parsedFuturePrice}</strong>입니다.
        </div>
      )}

      {parsedFuturePrice && (
        <button className="future-toggle-btn" onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? '🔼 상세 내용 닫기' : '🔽 상세 분석 보기'}
        </button>
      )}

      {showDetail && (
        <div className="future-analysis-wrapper">
          <h3>📊 현재 시세 분석 내용</h3>
          <div className="markdown-output" dangerouslySetInnerHTML={{ __html: currentHTML }} />
          <h3>📈 향후 시세 분석 내용</h3>
          <div className="markdown-output" dangerouslySetInnerHTML={{ __html: futureHTML }} />
        </div>
      )}
    </div>
  );
};

export default Future;