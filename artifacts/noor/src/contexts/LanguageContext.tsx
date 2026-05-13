import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export type Lang = "en" | "ur" | "ar";

interface LanguageContextType {
  language: Lang;
  dir: "ltr" | "rtl";
  setLanguage: (lang: Lang) => void;
}

const RTL_LANGS: Lang[] = ["ar", "ur"];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const resolve = (): Lang => {
    const stored = localStorage.getItem("tazki_lang") as Lang | null;
    const fromUser = (user as Record<string, unknown> | null)?.["language"] as Lang | undefined;
    return fromUser || stored || "en";
  };

  const [language, setLangState] = useState<Lang>(resolve);

  useEffect(() => {
    const fromUser = (user as Record<string, unknown> | null)?.["language"] as Lang | undefined;
    if (fromUser) {
      setLangState(fromUser);
    }
  }, [user]);

  useEffect(() => {
    const dir = RTL_LANGS.includes(language) ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    localStorage.setItem("tazki_lang", language);
  }, [language]);

  const setLanguage = (lang: Lang) => {
    setLangState(lang);
    localStorage.setItem("tazki_lang", lang);
  };

  const dir = RTL_LANGS.includes(language) ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, dir, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
