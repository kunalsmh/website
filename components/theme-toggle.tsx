"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ThemeToggle() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        root.classList.toggle("dark", savedTheme === "dark");
        return;
      }
    } catch {
      // Ignore storage errors in private/blocked contexts.
    }

    const isLetterboxd =
      pathname === "/letterboxd" || pathname.startsWith("/letterboxd/");
    root.classList.toggle("dark", isLetterboxd);
  }, [pathname]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nowDark = root.classList.toggle("dark");
    root.classList.add("theme-animating");
    window.setTimeout(() => {
      root.classList.remove("theme-animating");
    }, 320);

    try {
      localStorage.setItem("theme", nowDark ? "dark" : "light");
    } catch {
      // Ignore storage errors in private/blocked contexts.
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="theme-switch fixed right-5 top-5 z-50"
    >
      <span className="theme-switch-track">
        <span className="theme-switch-thumb" />
      </span>
    </button>
  );
}
