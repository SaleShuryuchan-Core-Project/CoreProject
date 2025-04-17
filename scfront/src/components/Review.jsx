import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ 서버 요청용
import '../css/review.css';

const Review = ({ openLoginSidePage }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    // ✅ 후기 전체 목록 서버에서 불러오기
    axios.get('http://localhost:8083/controller/api/review/list')
      .then(res => setPosts(res.data))
      .catch(err => console.error('후기 목록 불러오기 실패:', err));
  }, []);

  const indexLast = currentPage * postsPerPage;
  const indexFirst = indexLast - postsPerPage;
  const currentPosts = posts.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const goWrite = () =>{
    if (!userInfo) {
      alert("로그인 후 이용해주세요.");
      openLoginSidePage(); // ✅ 사이드 로그인 창 열기
      return;
    }
    navigate('/review_write')
  }

  return (
    <div className="subMains">
      <div className="review-wrapper">
        <h1>후기 게시판</h1>
        <table className="reviewTable">
          <thead>
            <tr className="reviewHeader">
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성날짜</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr className="reviewBody"><td colSpan="4">작성된 글이 없습니다.</td></tr>
            ) : (
              currentPosts.map((post, index) => (
                <tr key={post.review_idx}
                  className="reviewBody"
                  onClick={() => navigate(`/review/${post.review_idx}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{(currentPage - 1) * postsPerPage + index + 1}</td>
                  <td className="title">{post.review_content.slice(0, 20)}...</td>
                  <td>{post.u_id}</td>
                  <td>{post.created_at?.split('T')[0]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지 넘김 */}
        <div className="reviewPageNum">
          {Array.from({ length: totalPages }, (_, i) => (
            <span key={i + 1}
              className={`pageNumber ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </span>
          ))}
        </div>

        <div>
          <button className="reviewWrite-btn" onClick={goWrite}>
            글쓰기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;