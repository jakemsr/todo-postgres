"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until mounted on client to safely show the correct UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Render skeleton placeholder to avoid layout shifts
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:scale-110 transition-transform"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <img src="/icon-sun.svg" alt="Sun Icon" />
      ) : (
        <img src="/icon-moon.svg" alt="Moon Icon" />
      )}
    </button>
  );
}
