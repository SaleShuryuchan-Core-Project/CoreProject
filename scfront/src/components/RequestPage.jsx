import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/requestpage.css';

const RequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('requestPosts')) || [];
      // 날짜 내림차순 정렬 (최신 글이 위로)
    return [...stored].sort((a, b) => b.id - a.id);
    });

// 게시판 페이지 이동
const [currentPage, setCurrentPage] = useState(1);
const postsPerPage = 5;
// 게시글 목록 자르기
const indexLast = currentPage * postsPerPage;
const indexFirst = indexLast - postsPerPage;
const currentPosts = posts.slice(indexFirst, indexLast);
const totalPages = Math.ceil(posts.length / postsPerPage);   // 전체 페이지 수 계산


useEffect(() => {
  if (location.state && location.state.title && location.state.detail) {
    const newPost = {
      id: Date.now(),
      title: location.state.title,
      detail: location.state.detail,
      writer: location.state.writer,
      date: new Date().toISOString().split('T')[0],
    };

    const existing = JSON.parse(localStorage.getItem('requestPosts')) || [];
    const updated = [newPost, ...existing];

    // 최신순으로 정렬
    const sorted = [...updated].sort((a, b) => b.id - a.id);

    // localStorage + state 모두 갱신
    localStorage.setItem('requestPosts', JSON.stringify(sorted));
    setPosts(sorted); // ✅ 여기서 상태 갱신 꼭 해줘야 반영됨

    // 상태 초기화
    setTimeout(() => navigate('/request', { replace: true }), 0);
  }
}, [location, navigate]);

  return (
    <div className='subMains'>
      <h1>요청 게시판</h1>
      <table className="requestTable">
        <thead>
          <tr className="requestHeader">
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성날짜</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr className="requestBody">
              <td colSpan="4">작성된 글이 없습니다.</td>
            </tr>
          ) : (
            // 게시글 순서
            currentPosts.map((post, index) => (
              <tr className="requestBody" key={post.id}
              onClick={() => navigate(`/request/${post.id}`)}
              style={{ cursor: 'pointer' }}
              >
               <td>{(currentPage - 1) * postsPerPage + index + 1}</td> {/* 번호 1부터 시작 */}
               <td className="title">{post.title}</td>
               <td>{post.writer}</td>
               <td>{post.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
    {/* 페이지 이동 버튼 추가 */}
    <div className="requestPageNum">
      {Array.from({ length: totalPages }, (_, i) => (
        <span
          key={i + 1}
          className={`pageNumber ${currentPage === i + 1 ? 'active' : ''}`}
          onClick={() => {
            console.log('클릭됨!');
            setCurrentPage(i + 1);}}>
          {i + 1}
        </span>
      ))}
      </div>


    {/* 글쓰기 버튼 */}
      <button className="requestWrite-btn" onClick={() => navigate('/request_write')}>
        글쓰기
      </button>
      
    </div>
  );
};

export default RequestPage;
