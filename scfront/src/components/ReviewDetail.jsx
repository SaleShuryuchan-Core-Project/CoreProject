import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/reviewdetail.css';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('reviewPosts');
    if (stored) {
      const posts = JSON.parse(stored);
      const found = posts.find(p => p.id === Number(id));
      setPost(found);
    }
  }, [id]);

  if (!post) return <div className="reviewContainer">글을 찾을 수 없습니다.</div>;

  return (
    <div className="reviewContainer">
      <div className="reviewCard">
        <h2 className="reviewTitle">{post.title}</h2>
        <div className="reviewMeta">
          <span><FaUser /> {post.writer}</span>
          <span><FaCalendarAlt /> {post.date}</span>
        </div>
        <div className="reviewStars">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < post.score ? 'star filled' : 'star'}>★</span>
          ))}
        </div>
        <p className="reviewContent">{post.detail}</p>
          {post.image && (
          <div style={{ marginTop: '20px' }}>
          <img src={post.image} alt="첨부 이미지" style={{ maxWidth: '100%', borderRadius: '12px' }} />
          </div>
        )}
        <div className="buttonWrapper">
          <button className="backBtn " onClick={() => navigate('/review')}>
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
