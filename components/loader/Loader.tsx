import React from "react";
import Image from "next/image";
import './CircuitMaster.css'

const PropwiseLoader: React.FC = () => (
  <div id="loading-wrapper">
    <div id="loading-content">
      {/* Rotating ring only */}
      <div className="spinner-ring"></div>

      {/* Static logo centered */}
      <div className="logo-overlay">
        <Image
          src="/img/Propwise Logo No BG.png"
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
        stroke="#0062D6"
        strokeWidth="2"
        className="propwise-text"
      >
        PROPWISE
      </text>
    </svg>

    <span id="loading-text">Loading...</span>
  </div>
);

export default PropwiseLoader;