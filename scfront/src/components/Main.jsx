import React from "react";
import Header from "./Header";
import LeftContainer from "./LeftContainer";
import MainContainer from "./MainContainer";
import "../css/leftcontainer.css";

const Main = () => {
  return (
    <div className="main">
      <div className="container"></div>
        <Header />
        <LeftContainer />
        <MainContainer />
   </div>
  );
};

export default Main;