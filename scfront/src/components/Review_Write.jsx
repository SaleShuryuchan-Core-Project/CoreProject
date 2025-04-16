import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ 서버와 통신 위해 추가
import '../css/review_write.css';

const Review_Write = () => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [writer, setWriter] = useState('');
  const [score, setScore] = useState(0); // ⭐ 별점
  const [hoverScore, setHoverScore] = useState(0); // ⭐ 마우스 hover 별점
  const [image, setImage] = useState(null); // 이미지 파일
  const [preview, setPreview] = useState(null); // 미리보기

  const navigate = useNavigate();

  // 이미지 선택하면 미리보기 세팅
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // base64 저장
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !detail || !writer) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      // 서버로 후기 데이터 전송
      const res = await axios.post('http://localhost:8083/controller/api/review/write', {
        p_idx: 1, // ✅ 임시 제품번호 (나중에 실제 연동)
        review_content: detail,
        review_ratings: score,
        review_img: preview, // base64 또는 경로
        u_id: writer
      });

      if (res.data === 'success') {
        alert('작성 완료!');
        navigate('/review');
      } else {
        alert('작성 실패!');
      }
    } catch (err) {
      console.error('작성 중 오류:', err);
      alert('서버와 연결 실패');
    }
  };

  return (
    <form className="reviewForm" onSubmit={handleSubmit}>
      <h2>후기 작성</h2>

      <label>작성자</label>
      <input type="text" value={writer} onChange={e => setWriter(e.target.value)} />

      <label>제목</label>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} />

      <label>사진 첨부</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <div className="imagePreview">
          <img src={preview} alt="미리보기" style={{ maxWidth: '300px', marginTop: '10px', borderRadius: '8px' }} />
          <button type="button" className="imageCancelBtn" onClick={() => {
            setPreview(null);
            setImage(null);
          }}>선택 취소</button>
        </div>
      )}

      <label>내용</label>
      <textarea rows="10" value={detail} onChange={e => setDetail(e.target.value)} />

      <label>후기 점수</label>
      <div className="reviewStar">
        {[1, 2, 3, 4, 5].map(num => (
          <span key={num}
            className={`star ${(hoverScore || score) >= num ? 'filled' : ''}`}
            onClick={() => setScore(num)}
            onMouseEnter={() => setHoverScore(num)}
            onMouseLeave={() => setHoverScore(0)}
          >★</span>
        ))}
      </div>

      <div className="buttonRow">
        <button type="button" className="reviewBackBtn" onClick={() => navigate('/review')}>뒤로</button>
        <button type="submit" className="reviewWriteBtn">등록</button>
      </div>
    </form>
  );
};

export default Review_Write;
