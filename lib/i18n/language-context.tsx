"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  LanguageMeta,
} from "./translations";

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  languages: LanguageMeta[];
  t: (key: string, fallback?: string) => string;
  isLargeText: boolean;
  isHighContrast: boolean;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("en");
  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  // Initialize preferences from localStorage on client
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("igg_lang") as LanguageCode | null;
      if (savedLang && TRANSLATIONS[savedLang]) {
        setLangState(savedLang);
      }

      const savedLarge = localStorage.getItem("igg_large_text") === "true";
      setIsLargeText(savedLarge);
      if (savedLarge) {
        document.documentElement.classList.add("large-text");
      }

      const savedContrast = localStorage.getItem("igg_high_contrast") === "true";
      setIsHighContrast(savedContrast);
      if (savedContrast) {
        document.documentElement.classList.add("high-contrast");
      }
    } catch {
      // LocalStorage unavailable, proceed with defaults
    }
  }, []);

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
    try {
      localStorage.setItem("igg_lang", newLang);
    } catch {
      // Ignore storage errors
    }
  };

  const toggleLargeText = () => {
    const next = !isLargeText;
    setIsLargeText(next);
    if (next) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }
    try {
      localStorage.setItem("igg_large_text", String(next));
    } catch {
      // Ignore storage errors
    }
  };

  const toggleHighContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    if (next) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    try {
      localStorage.setItem("igg_high_contrast", String(next));
    } catch {
      // Ignore storage errors
    }
  };

  /**
   * Resilient translation resolver:
   * 1. Checks current language.
   * 2. Falls back to English.
   * 3. Falls back to provided fallback string or key.
   * Never throws or returns undefined.
   */
  const t = (key: string, fallback?: string): string => {
    const currentDict = TRANSLATIONS[lang];
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    const enDict = TRANSLATIONS["en"];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        languages: SUPPORTED_LANGUAGES,
        t,
        isLargeText,
        isHighContrast,
        toggleLargeText,
        toggleHighContrast,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
