import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../img/Logo.png";
import "../css/header.css";

const Header = () => {
  const nav = useNavigate();

  return (
    <header className="header">
      <div className="headerWrapper">
        <h1>
          <a href={() => nav('/')}>
            <img src={Logo} width="135px" alt="logo" />
          </a>
        </h1>
      </div>
    </header>
  );
};

export default Header;
