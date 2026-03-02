import { createContext, useContext, useEffect, useState } from "react";

export const THEMES = {
  sahara: {
    id: "sahara",
    name: "Sahara",
    description: "Warm sand, sage green, golden accents",
    icon: "☀️",
    isDark: false,
  },
  mosque: {
    id: "mosque",
    name: "Mosque Green",
    description: "Ivory, deep forest green, rich gold",
    icon: "🕌",
    isDark: false,
  },
  marrakesh: {
    id: "marrakesh",
    name: "Marrakesh",
    description: "Sandy beige, teal, burnt orange",
    icon: "🏺",
    isDark: false,
  },
  night: {
    id: "night",
    name: "Night Mode",
    description: "Deep indigo, vibrant teal, warm gold",
    icon: "🌙",
    isDark: true,
  },
  ramadan: {
    id: "ramadan",
    name: "Ramadan Blue",
    description: "Deep plum, celestial blue, silver",
    icon: "✨",
    isDark: true,
  },
  desertRose: {
    id: "desertRose",
    name: "Desert Rose",
    description: "Dusty rose, deep coral, warm peach",
    icon: "🌸",
    isDark: false,
  },
};

const THEME_STORAGE_KEY = "zakatify-theme";
const DEFAULT_THEME = "sahara";

const ThemeContext = createContext({
  currentTheme: THEMES[DEFAULT_THEME],
  setTheme: () => {},
  toggleDarkMode: () => {},
  isDark: false,
});

function getSystemPreference() {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : DEFAULT_THEME;
}

export function ThemeProvider({ children }) {
  const [currentThemeId, setCurrentThemeId] = useState(DEFAULT_THEME);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && THEMES[stored]) {
      setCurrentThemeId(stored);
    } else {
      setCurrentThemeId(getSystemPreference());
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem(THEME_STORAGE_KEY, currentThemeId);
    document.documentElement.setAttribute("data-theme", currentThemeId);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const themeColors = {
        sahara: "#f5ede0",
        mosque: "#fafaf5",
        marrakesh: "#f5efe6",
        night: "#0f1424",
        ramadan: "#0c0812",
        desertRose: "#f5ebe8",
      };
      metaThemeColor.setAttribute("content", themeColors[currentThemeId]);
    }
  }, [currentThemeId, isInitialized]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        setCurrentThemeId(e.matches ? "night" : DEFAULT_THEME);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (themeId) => {
    if (THEMES[themeId]) {
      setCurrentThemeId(themeId);
    }
  };

  const toggleDarkMode = () => {
    const darkThemes = ["night", "ramadan"];
    const lightThemes = ["sahara", "mosque", "marrakesh", "desertRose"];

    if (THEMES[currentThemeId].isDark) {
      setCurrentThemeId("sahara");
    } else {
      setCurrentThemeId("night");
    }
  };

  const value = {
    currentTheme: THEMES[currentThemeId],
    currentThemeId,
    setTheme,
    toggleDarkMode,
    isDark: THEMES[currentThemeId].isDark,
    allThemes: Object.values(THEMES),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
