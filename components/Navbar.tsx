"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "../src/img/Propwise Logo No BG.png";

interface NavbarProps {
  onLoginClick: () => void;
  onInquiriesClick: () => void;
}

export default function Navbar({ onLoginClick, onInquiriesClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleInquiriesClick = () => {
    onInquiriesClick();
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    onLoginClick();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        {/* Brand */}
        <div className="brand">
          <Image src={Logo} width={60} height={60} alt="Logo" className="logo-image" />
          <h1 className="title">PROPWISE</h1>
        </div>

        {/* Desktop navigation */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button
            type="button"
            onClick={handleInquiriesClick}
            className="btn btn-inquiries"
          >
            Inquiries
          </button>
          <button
            type="button"
            onClick={handleLoginClick}
            className="btn btn-login"
          >
            Login
          </button>
        </nav>

        {/* Hamburger toggle button */}
        <button
          onClick={toggleMobileMenu}
          className="hamburger-btn"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? (
            <svg
              className="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      <nav
        id="mobile-menu"
        className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}
        aria-label="Mobile navigation"
        >
        <ul>
            <li>
            <button
                type="button"
                onClick={handleInquiriesClick}
                className="btn btn-inquiries full-width"
            >
                Inquiries
            </button>
            </li>
            <li>
            <button
                type="button"
                onClick={handleLoginClick}
                className="btn btn-login full-width"
            >
                Login
            </button>
            </li>
        </ul>
      </nav>
    </header>
  );
}