import type { Metadata } from "next";
import ThemeToggle from "@/components/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kunal",
  description: "Personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setThemeScript = `
    (function () {
      try {
        var savedTheme = localStorage.getItem("theme");
        var pathname = window.location.pathname || "";
        var isLetterboxd = pathname === "/letterboxd" || pathname.indexOf("/letterboxd/") === 0;
        var hasSavedTheme = savedTheme === "dark" || savedTheme === "light";
        var shouldUseDark = hasSavedTheme ? savedTheme === "dark" : isLetterboxd;
        document.documentElement.classList.toggle("dark", shouldUseDark);
      } catch (error) {}
    })();
  `;

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: setThemeScript }} />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
