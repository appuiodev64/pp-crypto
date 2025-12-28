import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-4 py-2 rounded-lg border text-sm shadow-glow transition bg-gray-200 dark:bg-card dark:text-white hover:scale-105"
    >
      {dark ? "🌙 Mode sombre" : "☀️ Mode clair"}
    </button>
  );
}
