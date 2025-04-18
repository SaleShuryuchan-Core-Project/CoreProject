import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ 서버와 통신 위해 추가
import "../css/review_write.css";

const Review_Write = () => {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [score, setScore] = useState(0); // ⭐ 별점
  const [hoverScore, setHoverScore] = useState(0); // ⭐ 마우스 hover 별점
  const [image, setImage] = useState(null); // 이미지 파일
  const [preview, setPreview] = useState([]); // 미리보기
  const [uploading, setUploading] = useState(false);
  const [info, setInfo] = useState({});
  const navigate = useNavigate();
  const [pidx, setPidx] = useState(2); // ✅ 실제 존재하는 P_IDX 값
  const storedUserId = localStorage.getItem("u_id");
  const [writer, setWriter] = useState(storedUserId || "");

  useEffect(() => {
    const userId = localStorage.getItem("u_id");
    if (userId) setWriter(userId);
  }, []);

  const uploadToImgbb = async (file, imageIndex) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=da2b2061055365320fc6e32a66dacf0d`,
        formData
      );
      const url = res.data.data.url;

      setInfo((prev) => {
        const newInfo = { ...prev };
        newInfo[`p_img${imageIndex + 1}`] = url; // p_img1, p_img2, p_img3
        return newInfo;
      });

      setPreview((prev) => {
        const newPreview = [...prev];
        newPreview[imageIndex] = url;
        return newPreview;
      });

      setUploading(false);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드 중 오류 발생");
      setUploading(false);
    }
  };
  // 새로추가함
  const resizeImage = (file, maxWidth = 800) => { // 사진 사이즈를 줄여서 업로드함 
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, { type: file.type });
              resolve(resizedFile);
            },
            file.type,
            0.7 // 품질 0~1 사이 (0.7이면 꽤 줄어듦)
          );
        };
      };
      reader.readAsDataURL(file);
    });
  };



  const handleFileChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) await uploadToImgbb(file, index);
  };

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
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8083/controller/api/review/write",
        {
          p_idx: 1,
          review_content: detail,
          review_ratings: score,
          review_img: info.p_img1 || "", // ✅ 업로드된 이미지 URL
          u_id: writer,
        }
      );

      console.log("넘어감?", res);

      if (res.data === "success") {
        alert("작성 완료!");
        navigate("/review");
      } else {
        alert("작성 실패!");
      }
    } catch (err) {
      console.error("작성 중 오류:", err);
      alert("서버와 연결 실패");
    }
  };


  return (
    <form className="reviewForm" onSubmit={handleSubmit}>
      <h2>후기 작성</h2>

      <label>작성자</label>
      <input
        type="text"
        value={writer}
        onChange={(e) => setWriter(e.target.value)}
      />

      <label>제목</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>사진 첨부</label>
      <input type="file" onChange={(e) => handleFileChange(e, 0)} />
      {preview.map((url, idx) =>
        url ? (
          <img
            key={idx}
            src={url}
            alt={`미리보기 ${idx + 1}`}
            width="150"
            style={{
              marginTop: "10px",
              borderRadius: "8px",
              marginRight: "10px",
            }}
          />
        ) : null
      )}
      <label>내용</label>
      <textarea
        rows="10"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
      />

      <label>후기 점수</label>
      <div className="reviewStar">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`star ${(hoverScore || score) >= num ? "filled" : ""}`}
            onClick={() => setScore(num)}
            onMouseEnter={() => setHoverScore(num)}
            onMouseLeave={() => setHoverScore(0)}
          >
            ★
          </span>
        ))}
      </div>

      <div className="buttonRow">
        <button
          type="button"
          className="reviewBackBtn"
          onClick={() => navigate("/review")}
        >
          뒤로
        </button>
        <button type="submit" className="reviewWriteBtn">
          등록
        </button>
      </div>
    </form>
  );
};

export default Review_Write;