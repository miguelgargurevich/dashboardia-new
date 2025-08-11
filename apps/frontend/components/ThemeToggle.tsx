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
      className="p-2 rounded-full bg-bg dark:bg-bg-dark text-gray-700 dark:text-primary"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? <FaSun size={16} /> : <FaMoon size={16} />}
    </button>
  );
}
