import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/request_write.css";
import Papa from "papaparse";
import axios from "axios";

const Request_Write = () => {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [writer, setWriter] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");

  const [seriesList, setSeriesList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [volumeList, setVolumeList] = useState([]);
  const [rawData, setRawData] = useState([]);

  const navigate = useNavigate();

  // ✅ 로그인 유저의 u_id를 작성자로 설정
  useEffect(() => {
    const basicUser = localStorage.getItem("userInfo");
    const kakaoUser = localStorage.getItem("kakaoUser");

    if (basicUser) {
      const parsed = JSON.parse(basicUser);
      setWriter(parsed.u_id); // ✅ u_id (기본 회원)
    } else if (kakaoUser) {
      const parsed = JSON.parse(kakaoUser);
      setWriter(parsed.u_id); // ✅ u_id (카카오 계정)
    }
  }, []);

  useEffect(() => {
    Papa.parse("/data/phone.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setRawData(results.data);
      },
    });
  }, []);

  const handleManufacturerChange = (e) => {
    const manufacturer = e.target.value;
    setSelectedManufacturer(manufacturer);
    setSelectedSeries(null);
    setSelectedModel(null);
    setSelectedVolume(null);
    setSelectedColor("");
    const filteredSeries = rawData
      .filter((item) => item.제조사 === manufacturer)
      .map((item) => item.시리즈)
      .filter((v, i, self) => self.indexOf(v) === i);
    setSeriesList(filteredSeries);
  };

  const handleSeriesChange = (e) => {
    const series = e.target.value;
    setSelectedSeries(series);
    setSelectedModel(null);
    setSelectedVolume(null);
    setSelectedColor("");
    const filteredModels = rawData
      .filter(
        (item) => item.제조사 === selectedManufacturer && item.시리즈 === series
      )
      .map((item) => item.모델)
      .filter((v, i, self) => self.indexOf(v) === i);
    setModelList(filteredModels);
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    setSelectedVolume(null);
    setSelectedColor("");
    const filteredVolumes = rawData
      .filter(
        (item) =>
          item.제조사 === selectedManufacturer &&
          item.시리즈 === selectedSeries &&
          item.모델 === model
      )
      .map((item) => item.용량)
      .filter((v, i, self) => self.indexOf(v) === i);
    setVolumeList(filteredVolumes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !title ||
      !detail ||
      !writer ||
      !selectedModel ||
      !selectedVolume ||
      !selectedColor
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const formData = {
      u_id: writer,
      req_title: title,
      req_content: detail,
      req_model: selectedModel,
    };

    console.log("🔥 전송 직전 formData 확인:", formData);

    axios
      .post("http://localhost:8083/controller/api/request/write", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "success") {
          alert("요청 등록 완료!");
          navigate("/request");
        } else {
          alert("등록 실패");
        }
      })
      .catch((err) => {
        console.error("등록 실패:", err);
      });
  };

  return (
    <form className="requestForm" onSubmit={handleSubmit}>
      <h2>요청사항 작성</h2>

      <label>작성자</label>
      <input type="text" value={writer} readOnly />

      <label>제목</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="select-row">
        <div className="select-group">
          <label>제조사</label>
          <select
            value={selectedManufacturer || ""}
            onChange={handleManufacturerChange}
          >
            <option value="">제조사 선택</option>
            <option value="삼성전자">삼성전자</option>
            <option value="애플">애플</option>
            <option value="LG전자">LG전자</option>
          </select>
        </div>
        <div className="select-group">
          <label>시리즈</label>
          <select
            value={selectedSeries || ""}
            onChange={handleSeriesChange}
            disabled={!selectedManufacturer}
          >
            <option value="">시리즈 선택</option>
            {seriesList.map((series, i) => (
              <option key={i} value={series}>
                {series}
              </option>
            ))}
          </select>
        </div>
        <div className="select-group">
          <label>모델</label>
          <select
            value={selectedModel || ""}
            onChange={handleModelChange}
            disabled={!selectedSeries}
          >
            <option value="">모델 선택</option>
            {modelList.map((model, i) => (
              <option key={i} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div className="select-group">
          <label>용량</label>
          <select
            value={selectedVolume || ""}
            onChange={(e) => setSelectedVolume(e.target.value)}
            disabled={!selectedModel}
          >
            <option value="">용량 선택</option>
            {volumeList.map((vol, i) => (
              <option key={i} value={vol}>
                {vol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedVolume && (
        <>
          <label>색상</label>
          <input
            type="text"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            placeholder="색상 입력"
          />
        </>
      )}

      <label>내용</label>
      <textarea
        rows="10"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
      />

      <div className="buttonRow">
        <button
          type="button"
          className="requestBackBtn"
          onClick={() => navigate("/request")}
        >
          뒤로
        </button>
        <button type="submit" className="requestWriteBtn">
          등록
        </button>
      </div>
    </form>
  );
};

export default Request_Write;