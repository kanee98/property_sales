"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="footer text-center py-4 bg-indigo-900 text-white">
      <p>
        &copy; {new Date().getFullYear()} Propwise. All Rights Reserved. Designed and built by{" "}
        <a href="https://fusionlabz.lk" target="_blank" rel="noopener noreferrer" className="underline">
          <b>FusionLabz</b>
        </a>
        .
      </p>
    </footer>
  );
}