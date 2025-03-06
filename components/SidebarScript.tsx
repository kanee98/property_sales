"use client";

import { useEffect } from "react";

export default function SidebarScript() {
  useEffect(() => {
    const allSideMenu = document.querySelectorAll<HTMLAnchorElement>("#sidebar .side-menu.top li a");

    allSideMenu.forEach((item) => {
      const li = item.parentElement as HTMLLIElement | null;
      if (!li) return;

      item.addEventListener("click", function () {
        allSideMenu.forEach((i) => {
          i.parentElement?.classList.remove("active");
        });
        li.classList.add("active");
      });
    });

    // TOGGLE SIDEBAR
    const menuBar = document.querySelector<HTMLElement>("#content nav .bx.bx-menu");
    const sidebar = document.getElementById("sidebar");

    if (menuBar && sidebar) {
      menuBar.addEventListener("click", function () {
        sidebar.classList.toggle("hide");
      });
    }

    // Adjust Sidebar on Window Resize
    function adjustSidebar() {
      if (!sidebar) return;
      if (window.innerWidth <= 576) {
        sidebar.classList.add("hide");
        sidebar.classList.remove("show");
      } else {
        sidebar.classList.remove("hide");
        sidebar.classList.add("show");
      }
    }

    window.addEventListener("load", adjustSidebar);
    window.addEventListener("resize", adjustSidebar);

    // SEARCH BUTTON TOGGLE
    const searchButton = document.querySelector<HTMLButtonElement>("#content nav form .form-input button");
    const searchButtonIcon = document.querySelector("#content nav form .form-input button .bx");
    const searchForm = document.querySelector<HTMLFormElement>("#content nav form");

    searchButton?.addEventListener("click", function (e) {
      if (window.innerWidth < 768) {
        e.preventDefault();
        searchForm?.classList.toggle("show");
        if (searchForm?.classList.contains("show")) {
          searchButtonIcon?.classList.replace("bx-search", "bx-x");
        } else {
          searchButtonIcon?.classList.replace("bx-x", "bx-search");
        }
      }
    });

    // DARK MODE SWITCH
    const switchMode = document.getElementById("switch-mode") as HTMLInputElement | null;
    switchMode?.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    });

    // NOTIFICATION MENU TOGGLE
    document.querySelector(".notification")?.addEventListener("click", function () {
      document.querySelector(".notification-menu")?.classList.toggle("show");
      document.querySelector(".profile-menu")?.classList.remove("show");
    });

    // PROFILE MENU TOGGLE
    document.querySelector(".profile")?.addEventListener("click", function () {
      document.querySelector(".profile-menu")?.classList.toggle("show");
      document.querySelector(".notification-menu")?.classList.remove("show");
    });

    // CLOSE MENUS IF CLICKED OUTSIDE
    window.addEventListener("click", function (e) {
      if (!(e.target as HTMLElement)?.closest(".notification") && !(e.target as HTMLElement)?.closest(".profile")) {
        document.querySelector(".notification-menu")?.classList.remove("show");
        document.querySelector(".profile-menu")?.classList.remove("show");
      }
    });    

    // MENU TOGGLE FUNCTION
    function toggleMenu(menuId: string) {
      const menu = document.getElementById(menuId);
      const allMenus = document.querySelectorAll<HTMLElement>(".menu");

      allMenus.forEach((m) => {
        if (m !== menu) {
          m.style.display = "none";
        }
      });

      if (menu) {
        menu.style.display = menu.style.display === "none" || menu.style.display === "" ? "block" : "none";
      }
    }

    // INITIALIZE MENUS AS HIDDEN
    document.addEventListener("DOMContentLoaded", function () {
      const allMenus = document.querySelectorAll<HTMLElement>(".menu");
      allMenus.forEach((menu) => {
        menu.style.display = "none";
      });
    });

    return () => {
      window.removeEventListener("resize", adjustSidebar);
    };
  }, []);

  return null;
}