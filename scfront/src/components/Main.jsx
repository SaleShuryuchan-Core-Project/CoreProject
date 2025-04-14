import React, { useState } from "react";
import Header from "./Header";
import LeftContainer from "./LeftContainer";
import MainContainer from "./MainContainer";
import MyPage from "./MyPage";
import CartPage from "./CartPage";
import "../css/leftcontainer.css";
import { Route, Routes } from 'react-router-dom'

const Main = () => {
  const [showPriceCheck, setShowPriceCheck] = useState(false); // 왼쪽에서 누를 때
  const [forceModeChange, setForceModeChange] = useState(0); // 버튼 눌릴 때마다 강제로 상태 전환

  const handleShowPriceCheck = () => {
    setShowPriceCheck(true); // 시세조회 컴포넌트 보이기
    setForceModeChange(prev => prev + 1); // 강제 리렌더 트리거
  };

  return (
    <div className="main">
      <Header />
      <LeftContainer onPriceCheckClick={handleShowPriceCheck} />
      <MainContainer forceShowPriceCheck={showPriceCheck} forceChangeTrigger={forceModeChange}/>
    </div>
  );
};

export default Main;
