import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/requestdetail.css';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';

const RequestDetail = () => {
  const { id } = useParams(); // URL에서 글 ID 추출
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('requestPosts');
    if (stored) {
      const posts = JSON.parse(stored);
      const found = posts.find(p => p.id === Number(id));
      setPost(found);
    }
  }, [id]);

  if (!post) return <div style={{ padding: '20px' }}>글을 찾을 수 없습니다.</div>;


  return (
    <div className="requestContainer">
      <div className="requestCard">
        <h2 className="requestTitle">{post.title}</h2>
        <div className="requestMeta">
          <span><FaUser /> {post.writer}</span>
          <span><FaCalendarAlt /> {post.date}</span>
        </div>

        <p className="requestContent">{post.detail}</p>
          {post.image && (
            <div style={{ marginTop: '20px' }}>
            <img src={post.image} alt="첨부 이미지" style={{ maxWidth: '100%', borderRadius: '12px' }} />
            </div>
          )}
        <div className="buttonWrapper">
          <button className="backBtn " onClick={() => navigate('/request')}>
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
};



export default RequestDetail;
