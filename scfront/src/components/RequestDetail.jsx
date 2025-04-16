import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/requestdetail.css';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:8083/controller/api/request/reqdetail', { id: Number(id) })
      .then((res) => {
        if (res.data) {
          setPost(res.data);
        } else {
          console.warn("❗ 데이터 없음");
        }
      })
      .catch((err) => {
        console.error("요청글 상세 조회 실패:", err);
      });
  }, [id]);

  if (!post) return <div className="requestContainer">글을 찾을 수 없습니다.</div>;

  return (
    <div className="requestContainer">
      <div className="requestCard">
        <h2 className="requestTitle">{post.req_title}</h2>
        <div className="requestMeta">
          <span><b>작성자:</b> {post.u_id}</span>
          <span><b>작성일:</b> {post.created_at?.split('T')[0]}</span>
        </div>
        <div className="requestMeta">
          <span><b>요청 모델:</b> {post.req_model}</span>
        </div>
        <p className="requestContent">{post.req_content}</p>
        <div className="buttonWrapper">
          <button className="backBtn" onClick={() => navigate('/request')}>
            목록
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;