"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-[#2f8a5b]/30 bg-gradient-to-r from-[#0c1310] to-[#1f6b45] py-3 text-center text-[#d9e9d4]">
      <p className="text-[11px] tracking-wide">
        &copy; {new Date().getFullYear()} Propwise. All Rights Reserved. Designed and built by{" "}
        <a href="https://fusionlabz.lk" target="_blank" rel="noopener noreferrer" className="text-[#d8c08a]">
          <b>FusionLabz</b>
        </a>
        .
      </p>
    </footer>
  );
}




