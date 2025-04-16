import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { marked } from 'marked';

const Future = ({ modelName, capacity, color, 기변상태 }) => {
  const [yearsLater, setYearsLater] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [parsedCurrentPrice, setParsedCurrentPrice] = useState('');
  const [parsedFuturePrice, setParsedFuturePrice] = useState('');
  const [currentHTML, setCurrentHTML] = useState('');
  const [futureHTML, setFutureHTML] = useState('');

  // 🔧 기본 조건 세팅 (메모이제이션으로 최적화)
  const detail = useMemo(() => ({
    상태: '중',
    구성품: '풀패키징',
    기변: 기변상태 || '확정기변',
    약정: '요금할인',
    보증: '기간종료'
  }), [기변상태]);

  const extractPrice = (text) => {
    const match = text.match(/예상 중고가는 약\s*([\d,]+)원/);
    return match ? match[1] : '분석 실패';
  };

  const fullModelName = `${modelName} ${capacity} ${color}`;

  // 🔍 현재 시세 분석 요청
  const handleCurrentPrice = useCallback(async () => {
    const prompt = `
다음 조건을 가진 중고폰의 **2025년 기준 현재 예상 시세**를 아래 형식으로 작성해줘.

[1] 시세에 영향을 주는 항목을 마크다운 표로 정리 (항목 | 영향 | 상승/하락 요인 설명)
[2] 구체적인 요약 문단을 포함해줘.
[3] 마지막에 반드시 아래 형식의 문장을 그대로 써줘:
"**이 핸드폰의 예상 중고가는 약 000,000원입니다.**"

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
    setParsedCurrentPrice(extractPrice(text));
    setCurrentHTML(marked.parse(text));
  }, [fullModelName, detail]);

  //  향후 시세 분석 요청
  const handleFuturePrice = async () => {
    const prompt = `
이 중고폰을 현재 기준으로 ${yearsLater}년(예: 2025년 → ${2025 + yearsLater}년) 뒤에 되팔 경우 예상되는 시세를 분석해줘.

[1] 각 항목이 시세에 미치는 영향과 함께 마크다운 표로 정리해줘 (항목 | 영향 | 상승/하락 요인 설명)
[2] 분석 요약을 구체적이고 간결하게 문단으로 정리해줘.
[3] 마지막에 반드시 아래 문장 형식을 지켜줘:
"**이 핸드폰의 ${yearsLater}년 뒤 예상 중고가는 약 000,000원입니다.**"

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
    <div style={{ padding: 20 }}>
      <h2>📱 현재 중고 시세 분석</h2>
      {parsedCurrentPrice && (
        <div style={{ marginTop: 10, fontSize: '1.1rem' }}>
          o(*￣▽￣*)ブ 현재 예상 중고가는 <strong style={{ color: '#007acc' }}>{parsedCurrentPrice}원</strong>입니다.
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />

      <h2>🕒 향후 시세 예측</h2>
      <input
        type="number"
        placeholder="몇 년 뒤?"
        value={yearsLater}
        onChange={(e) => setYearsLater(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={handleFuturePrice} disabled={!yearsLater}>예상 시세 예측</button>

      {parsedFuturePrice && (
        <div style={{ marginTop: 10, fontSize: '1.1rem' }}>
          📉 {yearsLater}년 뒤 예상 시세는 <strong style={{ color: 'crimson' }}>{parsedFuturePrice}원</strong>입니다.
        </div>
      )}

      {parsedFuturePrice && (
        <button onClick={() => setShowDetail(!showDetail)} style={{ marginTop: 10 }}>
          {showDetail ? '🔼 상세 내용 닫기' : '🔽 상세 분석 보기'}
        </button>
      )}

      {showDetail && (
        <div style={{ marginTop: 20 }}>
          <h3>📊 현재 시세 분석 내용</h3>
          <div dangerouslySetInnerHTML={{ __html: currentHTML }} />
          <h3>📈 향후 시세 분석 내용</h3>
          <div dangerouslySetInnerHTML={{ __html: futureHTML }} />
        </div>
      )}
    </div>
  );
};

export default Future;
