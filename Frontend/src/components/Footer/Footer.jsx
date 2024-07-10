import React from "react";
import moonIcon from "../../assets/moonIcon.svg";
import sunIcon from "../../assets/sunIcon.svg";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-area">
      <div className="container">
        <button className="toggle-btn">
          <img src={moonIcon} alt="moonicon" />
          <img src={sunIcon} alt="sunicon" />
        </button>
      </div>
    </div>
  );
};

export default Footer;
