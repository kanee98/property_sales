"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-[#7ea174]/30 bg-gradient-to-r from-[#0b0f19] to-[#1f2937] py-3 text-center text-[#d9e9d4]">
      <p className="text-[11px] tracking-wide">
        &copy; {new Date().getFullYear()} Propwise. All Rights Reserved. Designed and built by{" "}
        <a href="https://fusionlabz.lk" target="_blank" rel="noopener noreferrer" className="text-[#a9c9a0]">
          <b>FusionLabz</b>
        </a>
        .
      </p>
    </footer>
  );
}
