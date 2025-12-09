// src/context/ThemeContext.js
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState("es"); // "es" o "en"

  const value = {
    isDark,
    setIsDark,
    language,
    setLanguage,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeSettings() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeSettings must be used within a ThemeProvider");
  }
  return ctx;
}
