"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const STORAGE_KEY = "POVS_SETTINGS";
const DEFAULT_SETTINGS = {
  theme: "system",
  largeStreamerCard: false,
  favorites: [],
};

const initialSettings = {
  ...DEFAULT_SETTINGS,
};

const getStoredSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    console.error("Failed to parse stored settings:", error);
    return initialSettings;
  }
};

const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Failed to save settings:", error);
    return false;
  }
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== "undefined") {
      return getStoredSettings();
    }
    return initialSettings;
  });
  const [isInitialized, setIsInitialized] = useState(
    typeof window !== "undefined"
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const allKeys = Object.keys(localStorage);
        allKeys.forEach((key) => {
          if (key !== STORAGE_KEY) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error("Failed to clean up localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      const storedSettings = getStoredSettings();
      setSettings(storedSettings);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    const applyTheme = (selectedTheme) => {
      if (selectedTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        document.documentElement.className = systemTheme;
      } else {
        document.documentElement.className = selectedTheme;
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e) => {
      if (settings.theme === "system") {
        applyTheme("system");
      }
    };

    applyTheme(settings.theme);
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [settings.theme, isInitialized]);

  const updateSettings = useCallback((key, value) => {
    if (!key || typeof key !== "string") {
      console.error("Invalid settings key:", key);
      return false;
    }

    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const setTheme = useCallback(
    (newTheme) => {
      if (!["light", "dark", "system"].includes(newTheme)) {
        console.error("Invalid theme:", newTheme);
        return false;
      }
      return updateSettings("theme", newTheme);
    },
    [updateSettings]
  );

  const toggleFavorite = useCallback(
    (streamerName) => {
      if (!streamerName) return;
      const lowerCaseName = streamerName.toLowerCase();
      setSettings((prev) => {
        const currentFavorites = prev.favorites || [];
        const isFavorite = currentFavorites.includes(lowerCaseName);
        const newFavorites = isFavorite
          ? currentFavorites.filter((name) => name !== lowerCaseName)
          : [...currentFavorites, lowerCaseName];

        const newSettings = { ...prev, favorites: newFavorites };
        saveSettings(newSettings);
        return newSettings;
      });
    },
    [updateSettings]
  );

  const contextValue = useMemo(
    () => ({
      settings,
      updateSettings,
      theme: settings.theme,
      setTheme,
      toggleFavorite,
      isInitialized,
    }),
    [settings, updateSettings, setTheme, toggleFavorite, isInitialized]
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
