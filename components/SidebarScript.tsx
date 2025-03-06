"use client";

import { useEffect } from "react";

export default function SidebarScript() {
  useEffect(() => {
    const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

    allSideMenu.forEach((item) => {
      const li = item.parentElement;
      item.addEventListener("click", function () {
        allSideMenu.forEach((i) => {
          i.parentElement.classList.remove("active");
        });
        li.classList.add("active");
      });
    });

    // TOGGLE SIDEBAR
    const menuBar = document.querySelector("#content nav .bx.bx-menu");
    const sidebar = document.getElementById("sidebar");

    if (menuBar && sidebar) {
      menuBar.addEventListener("click", function () {
        sidebar.classList.toggle("hide");
      });
    }

    // Adjust Sidebar on Window Resize
    function adjustSidebar() {
      if (window.innerWidth <= 576) {
        sidebar?.classList.add("hide");
        sidebar?.classList.remove("show");
      } else {
        sidebar?.classList.remove("hide");
        sidebar?.classList.add("show");
      }
    }

    window.addEventListener("load", adjustSidebar);
    window.addEventListener("resize", adjustSidebar);

    return () => {
      window.removeEventListener("resize", adjustSidebar);
    };
  }, []);

  return null; // This component does not render anything
}
