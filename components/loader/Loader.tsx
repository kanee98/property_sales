import React from "react";
import Image from "next/image";
import "./CircuitMaster.css";
import Logo from "../../src/img/Propwise Logo No BG.png";

const PropwiseLoader: React.FC = () => (
  <div id="loading-wrapper">
    <div className="loader-grid" />
    <div id="loading-content">
      <div className="spinner-ring"></div>
      <div className="logo-overlay">
        <Image
          src={Logo}
          alt="Logo"
          width={150}
          height={150}
          className="loader-logo"
          priority
        />
      </div>
    </div>

    <svg
      viewBox="0 0 600 150"
      xmlns="http://www.w3.org/2000/svg"
      className="propwise-svg"
      id="propwise-text-svg"
    >
      <text
        x="50%"
        y="70%"
        textAnchor="middle"
        fontSize="100"
        fontFamily="Arial, sans-serif"
        fill="none"
        stroke="#d8c08a"
        strokeWidth="2"
        className="propwise-text"
      >
        PROPWISE
      </text>
    </svg>

    <div className="loader-progress" aria-hidden="true">
      <span className="loader-progress-bar" />
    </div>
    <span id="loading-text">Preparing your listings</span>
    <div className="loader-dots" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  </div>
);

export default PropwiseLoader;
