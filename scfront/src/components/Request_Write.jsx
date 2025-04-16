import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/request_write.css';
import axios from 'axios';

// const Request_Write = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     detail: ''
//   });

const Request_Write = () => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [writer, setWriter] = useState('');
  const [image, setImage] = useState(null); // 이미지 파일 저장용
  const [preview, setPreview] = useState(null); // 이미지 미리보기

  const navigate = useNavigate();


  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

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
  

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   alert('작성 완료!');
  //   navigate('/request', {state:formData});
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !detail || !writer) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:8083/controller/api/request/write", {
        u_id: writer,
        req_title: title,
        req_content: detail
      });
  
      if (res.data === "success") {
        alert("작성 완료!");
        navigate("/request");
      } else {
        alert("작성 실패! 서버 응답: " + res.data);
      }
    } catch (err) {
      console.error("작성 중 오류:", err);
      alert("요청 실패: 콘솔을 확인하세요.");
    }
  };
  
return (
  // <div className="subMains">
    <form className="requestForm" onSubmit={handleSubmit}>
      <h2>요청사항 작성</h2>

      <label>작성자</label>
      <input type="text" value={writer} onChange={e => setWriter(e.target.value)} />

      <label>제목</label>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} />

      {/* 이미지 업로드 구간 */}  
      <label>사진 첨부</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {/* {preview && (
        <div className="image-preview">
          <img src={preview} alt="미리보기" style={{ maxWidth: '300px', marginTop: '10px' }} />
        </div>
      )} */}
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

      <div className="buttonRow">
        <button type="button" className="requestBackBtn" style={{alignSelf: 'flex-end'}} onClick={() => navigate('/request')}>뒤로</button>
        <button type="submit" className="requestWriteBtn" style={{alignSelf: 'flex-end'}}>등록</button>
        </div>

    </form>
);
};





export default Request_Write;
