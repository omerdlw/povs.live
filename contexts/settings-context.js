"use client";

import { THEMES, VALID_THEMES, STORAGE_KEYS } from "@/config/constants";
import { GET_STORAGE_ITEM, SET_STORAGE_ITEM } from "@/lib/utils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const SettingsContext = createContext(undefined);

const DEFAULT_SETTINGS = {
  theme: THEMES.SYSTEM,
  largeStreamerCard: false,
};

const getStoredSettings = () => {
  const stored = GET_STORAGE_ITEM(STORAGE_KEYS.SETTINGS);
  return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
};

const saveSettings = (settings) => {
  return SET_STORAGE_ITEM(STORAGE_KEYS.SETTINGS, settings);
};

const applyThemePreference = (theme) => {
  if (typeof window === "undefined") return;

  let effectiveTheme = theme;

  if (theme === THEMES.SYSTEM) {
    effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  }

  document.documentElement.className = effectiveTheme;
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSettings(getStoredSettings());
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    applyThemePreference(settings.theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (settings.theme === THEMES.SYSTEM) {
        applyThemePreference(THEMES.SYSTEM);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [settings.theme, isInitialized]);

  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const setTheme = useCallback(
    (newTheme) => {
      if (!VALID_THEMES.includes(newTheme)) {
        console.error(`Invalid theme: ${newTheme}`);
        return;
      }
      updateSettings({ theme: newTheme });
    },
    [updateSettings],
  );

  const toggleTheme = useCallback(() => {
    const newTheme =
      settings.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
  }, [settings.theme, setTheme]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  const contextValue = useMemo(
    () => ({
      theme: settings.theme,
      updateSettings,
      isInitialized,
      resetSettings,
      toggleTheme,
      settings,
      setTheme,
    }),
    [
      updateSettings,
      resetSettings,
      isInitialized,
      toggleTheme,
      settings,
      setTheme,
    ],
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
