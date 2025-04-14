// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import LeftContainer from "./LeftContainer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="main">
      <div className="container">
        <Header />
        <LeftContainer />
        {/* 각 페이지가 이 안에 렌더링됨 */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
