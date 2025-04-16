import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/reviewdetail.css';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8083/controller/api/review/detail/${id}`)
      .then(res => {
        if (res.data) {
          setPost(res.data);
        } else {
          console.warn("❗ 데이터 없음");
          setPost(null);
        }
      })
      .catch(err => {
        console.error("상세 조회 실패:", err);
        setPost(null);
      });
  }, [id]);
  
  if (!post) return <div className="reviewContainer">글을 찾을 수 없습니다.</div>;

  return (
    <div className="reviewContainer">
      <div className="reviewCard">
        <h2 className="reviewTitle">{post.review_content.slice(0, 20)}...</h2>
        <div className="reviewMeta">
          <span><FaUser /> {post.u_id}</span>
          <span><FaCalendarAlt /> {post.created_at?.split('T')[0]}</span>
        </div>
        <div className="reviewStars">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < post.review_ratings ? 'star filled' : 'star'}>★</span>
          ))}
        </div>
        <p className="reviewContent">{post.review_content}</p>
        {post.review_img && (
          <div style={{ marginTop: '20px' }}>
            <img src={post.review_img} alt="첨부 이미지" style={{ maxWidth: '100%', borderRadius: '12px' }} />
          </div>
        )}
        <div className="buttonWrapper">
          <button className="backBtn" onClick={() => navigate('/review')}>목록으로</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
