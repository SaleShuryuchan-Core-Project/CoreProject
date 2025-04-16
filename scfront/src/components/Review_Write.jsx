import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/review_write.css';

const Review_Write = () => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [writer, setWriter] = useState('');
  const [score, setScore] = useState(0); // ⭐ 별점 상태 추가
  const [hoverScore, setHoverScore] = useState(0); // ⭐️ 마우스 올렸을 때 임시 별점
  const [image, setImage] = useState(null); // 이미지 파일 저장용
  const [preview, setPreview] = useState(null); // 이미지 미리보기


  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수값 체크
    if (!title || !detail || !writer) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
 
    
    // nav('/review', {
    //   state: {
    //     title,
    //     detail,
    //     writer,
    //     score, // ⭐ score도 함께 전달
    //   }
    // });
    
    
    // 게시글 생성 및 저장
    const newPost = {
    id: Date.now(),
    title,
    detail,
    writer,
    score,
    date: new Date().toISOString().slice(0, 10),
    image: preview // ✅ 이미지 base64 미리보기 주소도 함께 저장
  };

  const stored = JSON.parse(localStorage.getItem('reviewPosts')) || [];
  stored.push(newPost);
  localStorage.setItem('reviewPosts', JSON.stringify(stored));
  
  
  alert('작성 완료!');
  navigate('/review');

};


  return (
    // <div className="subMains">
      <form className="reviewForm" onSubmit={handleSubmit}>
        <h2>후기 작성</h2>

        <label>작성자</label>
        <input type="text" value={writer} onChange={e => setWriter(e.target.value)} />

        <label>제목</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />

        {/* ⭐ 이미지 업로드 구간 */}
        <label>사진 첨부</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
        <div className="imagePreview">
          <img src={preview} alt="미리보기" style={{ maxWidth: '300px', marginTop: '10px', borderRadius: '8px' }} />
          <button
            type="button"
            className="imageCancelBtn"
            onClick={() => {
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
            <span
              key={num}
              className={`star ${(hoverScore || score) >= num ? 'filled' : ''}`}
              onClick={() => setScore(num)}
              onMouseEnter={() => setHoverScore(num)}
              onMouseLeave={() => setHoverScore(0)}
            >★</span>
          ))}
        </div>
        <div className="buttonRow">
        <button type="button" className="reviewBackBtn" style={{alignSelf: 'flex-end'}} onClick={() => navigate('/review')}>뒤로</button>
        <button type="submit" className="reviewWriteBtn" style={{alignSelf: 'flex-end'}}>등록</button>
        </div>
      </form>
  );
};

export default Review_Write;
