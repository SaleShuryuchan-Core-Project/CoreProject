import React from "react";
import Header from "./Header";
import LeftContainer from "./LeftContainer";
import MainContainer from "./MainContainer";

const Main = () => {
  return (
    <div className="main">
      <div className="container">
        <Header />
        <LeftContainer />
        <MainContainer />
      </div>
    </div>
  );
};

export default Main;
