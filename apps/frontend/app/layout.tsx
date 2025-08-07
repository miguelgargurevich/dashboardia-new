
"use client";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Solo se ejecuta en el cliente
    const theme = localStorage.getItem("theme");
    setDark(theme === "dark");
  }, []);

  useEffect(() => {
    if (dark === undefined) return;
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Evita renderizar hasta que dark esté definido
  if (dark === undefined) {
    return null;
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={dark ? "bg-darkBg" : "bg-gray-50"}>
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setDark((d) => !d)}
            className={`p-2 rounded-full shadow transition flex items-center justify-center w-10 h-10 text-xl ${dark ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
            aria-label="Toggle dark mode"
            title={dark ? "Modo claro" : "Modo oscuro"}
          >
            {dark ? "🌙" : "☀️"}
          </button>
        </div>
        <Sidebar />
        <main className="flex-1 ml-56">{children}</main>
      </body>
    </html>
  );
}
