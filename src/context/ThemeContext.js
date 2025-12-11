// src/context/ThemeContext.js
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Estado global de modo oscuro
  const [isDark, setIsDark] = useState(false);

  // Por si quieres usar un toggle simple
  const toggleTheme = () => setIsDark((prev) => !prev);

  const value = useMemo(
    () => ({
      isDark,      // bool  -> si está en modo oscuro
      setIsDark,   // fn    -> setIsDark(true/false)
      toggleTheme, // fn    -> invierte el tema
    }),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook para usarlo en las pantallas
export function useThemeSettings() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error(
      "useThemeSettings debe usarse dentro de <ThemeProvider>"
    );
  }
  return ctx;
}
