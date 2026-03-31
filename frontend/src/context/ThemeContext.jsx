import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getThemeLogo } from "../lib/branding";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);

    const favicon = document.getElementById("app-favicon");
    if (favicon) {
      favicon.setAttribute("href", getThemeLogo(theme === "dark"));
    }
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    isDark: theme === "dark",
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    setTheme
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
