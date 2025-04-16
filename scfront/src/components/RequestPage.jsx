import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/requestpage.css';

const RequestPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    axios.post('http://localhost:8083/controller/api/request/list')
      .then(res => setPosts(res.data))
      .catch(err => console.error('요청 목록 조회 실패:', err));
  }, []);

  const indexLast = currentPage * postsPerPage;
  const indexFirst = indexLast - postsPerPage;
  const currentPosts = posts.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className='subMains'>
      <h1>요청 게시판</h1>
      <table className="requestTable">
        <thead>
          <tr className="requestHeader">
            <th>번호</th>
            <th>제목</th>
            <th>요청 모델</th>
            <th>작성자</th>
            <th>작성날짜</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr className="requestBody"><td colSpan="5">작성된 글이 없습니다.</td></tr>
          ) : (
            currentPosts.map((post, index) => (
              <tr key={post.req_idx} className="requestBody"
                onClick={() => navigate(`/request/${post.req_idx}`)}
                style={{ cursor: 'pointer' }}>
                <td>{(currentPage - 1) * postsPerPage + index + 1}</td>
                <td className="title">{post.req_title}</td>
                <td>{post.req_model}</td>
                <td>{post.u_id}</td>
                <td>{post.created_at?.split('T')[0]}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="requestPageNum">
        {Array.from({ length: totalPages }, (_, i) => (
          <span key={i + 1}
            className={`pageNumber ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </span>
        ))}
      </div>

      <button className="requestWrite-btn" onClick={() => navigate('/request_write')}>글쓰기</button>
    </div>
  );
};

export default RequestPage;