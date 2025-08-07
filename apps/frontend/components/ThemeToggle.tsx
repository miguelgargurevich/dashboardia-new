"use client";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      aria-label="Toggle dark mode"
      className="p-2 rounded-full bg-secondary text-white dark:bg-darkBg dark:text-primary transition"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? <FaSun size={20} /> : <FaMoon size={20} />}
    </button>
  );
}
