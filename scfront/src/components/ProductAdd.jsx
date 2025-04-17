import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import "../css/productadd.css";

const AddProductPage = () => {
  const nav = useNavigate();

  const [rawData, setRawData] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");

  const [seriesList, setSeriesList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [volumeList, setVolumeList] = useState([]);

  const [info, setInfo] = useState({
    p_name: "",
    price: "",
    p_status: "",
    p_ownership: "",
    p_img1: "",
    p_img2: "",
    p_img3: "",
    color: "",
  });

  const [preview, setPreview] = useState(["", "", ""]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Papa.parse("/data/phone.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setRawData(results.data);
      },
    });
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

  const handleFileChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) await uploadToImgbb(file, index);
  };

  const handleManufacturerChange = (e) => {
    const manufacturer = e.target.value;
    setSelectedManufacturer(manufacturer);
    setSelectedSeries(null);
    setSelectedModel(null);
    setSelectedVolume(null);
    setSelectedColor("");
    const filtered = rawData
      .filter((item) => item.제조사 === manufacturer)
      .map((item) => item.시리즈)
      .filter((v, i, self) => self.indexOf(v) === i);
    setSeriesList(filtered);
  };

  const handleSeriesChange = (e) => {
    const series = e.target.value;
    setSelectedSeries(series);
    setSelectedModel(null);
    setSelectedVolume(null);
    setSelectedColor("");
    const filtered = rawData
      .filter(
        (item) => item.제조사 === selectedManufacturer && item.시리즈 === series
      )
      .map((item) => item.모델)
      .filter((v, i, self) => self.indexOf(v) === i);
    setModelList(filtered);
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    setSelectedVolume(null);
    setSelectedColor("");
    const filtered = rawData
      .filter(
        (item) =>
          item.제조사 === selectedManufacturer &&
          item.시리즈 === selectedSeries &&
          item.모델 === model
      )
      .map((item) => item.용량)
      .filter((v, i, self) => self.indexOf(v) === i);
    setVolumeList(filtered);
  };

  const handleSubmit = async () => {
    if (!selectedModel || !selectedVolume || !info.price || !info.p_status) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const fullName = `${selectedManufacturer} ${selectedModel} ${selectedVolume}`;
    const sendData = { ...info, p_name: fullName };

    try {
      await axios.post("http://localhost:8083/controller/add", sendData);
      alert("제품이 등록되었습니다!");
      nav("/ProductManagement");
    } catch (err) {
      console.error("등록 실패:", err);
      alert("등록 중 오류 발생");
    }
  };

  return (
    <div className="productadd-management-wrapper">
      <h2 className="addmanagement-title">제품 추가</h2>
      <div className="add-product-form">
        {/* ✅ 제품 선택 먼저 표시 */}
        <div className="form-group">
          <label>제품 선택:</label>
          <div className="select-row">
            <select
              value={selectedManufacturer || ""}
              onChange={handleManufacturerChange}
            >
              <option value="">제조사 선택</option>
              <option value="삼성전자">삼성전자</option>
              <option value="애플">애플</option>
              <option value="LG전자">LG전자</option>
            </select>
            <select
              value={selectedSeries || ""}
              onChange={handleSeriesChange}
              disabled={!selectedManufacturer}
            >
              <option value="">시리즈 선택</option>
              {seriesList.map((v, i) => (
                <option key={i} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <select
              value={selectedModel || ""}
              onChange={handleModelChange}
              disabled={!selectedSeries}
            >
              <option value="">모델 선택</option>
              {modelList.map((v, i) => (
                <option key={i} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <select
              value={selectedVolume || ""}
              onChange={(e) => setSelectedVolume(e.target.value)}
              disabled={!selectedModel}
            >
              <option value="">용량 선택</option>
              {volumeList.map((v, i) => (
                <option key={i} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            onChange={(e) => setInfo({ ...info, color: e.target.value })}
            placeholder="색상 입력"
          />
        </div>

        {/* 가격 */}
        <div className="form-group">
          <label>가격:</label>
          <input
            type="number"
            name="price"
            onChange={(e) => setInfo({ ...info, price: e.target.value })}
          />
        </div>

        {/* 제품 상태 */}
        <div className="form-group">
          <label>제품 상태:</label>
          <textarea
            name="p_status"
            onChange={(e) => setInfo({ ...info, p_status: e.target.value })}
          />
        </div>

        {/* 직접 업로드 */}
        <div className="form-group">
          <label>또는 직접 업로드:</label>
          <input type="file" onChange={(e) => handleFileChange(e, 0)} />
          <input type="file" onChange={(e) => handleFileChange(e, 1)} />
          <input type="file" onChange={(e) => handleFileChange(e, 2)} />
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
        </div>

        {/* 보유 상태 */}
        <div className="form-group">
          <label>보유 상태:</label>
          <input
            type="number"
            name="p_ownership"
            onChange={(e) => setInfo({ ...info, p_ownership: e.target.value })}
            value={info.p_ownership}
          />
        </div>

        <button
          className="productadd-btn"
          onClick={handleSubmit}
          disabled={uploading}
        >
          {uploading ? "업로드 중..." : "제품 추가"}
        </button>
      </div>
    </div>
  );
};

export default AddProductPage;
