import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  loadUserPreferences,
  saveUserPreferences,
} from "../services/dataService";

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
const ACCORDION_STORAGE_KEY = "zakatify_accordion_state_v1";
const DEFAULT_THEME = "sahara";

const ThemeContext = createContext({
  currentTheme: THEMES[DEFAULT_THEME],
  setTheme: () => {},
  toggleDarkMode: () => {},
  isDark: false,
  accordionState: {},
  setAccordionState: () => {},
});

function getSystemPreference() {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : DEFAULT_THEME;
}

function loadLocalStorageTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && THEMES[stored]) {
      return stored;
    }
  } catch (_e) {}
  return getSystemPreference();
}

function loadLocalStorageAccordion() {
  try {
    const stored = localStorage.getItem(ACCORDION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (_e) {}
  return {};
}

export function ThemeProvider({ children }) {
  const { session, loading: authLoading } = useAuth();
  const [currentThemeId, setCurrentThemeId] = useState(loadLocalStorageTheme);
  const [accordionState, setAccordionState] = useState(
    loadLocalStorageAccordion,
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    async function loadPreferences() {
      if (session?.user) {
        try {
          const prefs = await loadUserPreferences(session.user.id);
          if (prefs) {
            if (prefs.theme && THEMES[prefs.theme]) {
              setCurrentThemeId(prefs.theme);
            }
            if (prefs.accordion_state) {
              setAccordionState(prefs.accordion_state);
            }
          }
        } catch (e) {
          console.warn("Failed to load from Supabase:", e);
        }
      }
      setIsInitialized(true);
    }

    loadPreferences();
  }, [session, authLoading]);

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
    if (!isInitialized) return;
    localStorage.setItem(ACCORDION_STORAGE_KEY, JSON.stringify(accordionState));
  }, [accordionState, isInitialized]);

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

  useEffect(() => {
    if (!session?.user) return;

    saveUserPreferences(session.user.id, {
      theme: currentThemeId,
      accordionState,
    }).catch((e) => {
      console.warn("Failed to save to Supabase:", e);
    });
  }, [session, currentThemeId, accordionState, isInitialized]);

  const setTheme = (themeId) => {
    if (THEMES[themeId]) {
      setCurrentThemeId(themeId);
    }
  };

  const toggleDarkMode = () => {
    if (THEMES[currentThemeId].isDark) {
      setCurrentThemeId("sahara");
    } else {
      setCurrentThemeId("night");
    }
  };

  const handleSetAccordionState = (section, isOpen) => {
    setAccordionState((prev) => ({
      ...prev,
      [section]: isOpen,
    }));
  };

  const value = {
    currentTheme: THEMES[currentThemeId],
    currentThemeId,
    setTheme,
    toggleDarkMode,
    isDark: THEMES[currentThemeId].isDark,
    allThemes: Object.values(THEMES),
    accordionState,
    setAccordionState: handleSetAccordionState,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
