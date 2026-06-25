"use client";

import { useEffect } from "react";

export default function AsciiCat({ className }: { className?: string }) {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const xRatio = event.clientX / window.innerWidth - 0.5;
      const yRatio = event.clientY / window.innerHeight - 0.5;

      document.documentElement.style.setProperty(
        "--cat-cursor-x",
        `${(xRatio * 24).toFixed(2)}px`,
      );
      document.documentElement.style.setProperty(
        "--cat-cursor-y",
        `${(yRatio * 18).toFixed(2)}px`,
      );
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.style.removeProperty("--cat-cursor-x");
      document.documentElement.style.removeProperty("--cat-cursor-y");
    };
  }, []);

  return (
    <div className={`ascii-cat-wrap ${className ?? ""}`}>
      <pre className="ascii-cat" aria-label="Animated ASCII cat">
        {" /\\_/\\\n"}
        {"("}
        <span className="cat-eye cat-eye-left">o</span>
        {" . "}
        <span className="cat-eye cat-eye-right">o</span>
        {")\n"}
        {" > ^ <\n"}
        {" /|_|\\\n"}
      </pre>
    </div>
  );
}
