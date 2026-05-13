import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export type Lang = "en" | "ur" | "ar";

export interface LanguageContextType {
  language: Lang;
  dir: "ltr" | "rtl";
  setLanguage: (lang: Lang) => void;
}

export const RTL_LANGS: Lang[] = ["ar", "ur"];

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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
    if (fromUser && fromUser !== language) {
      setLangState(fromUser);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const dir = RTL_LANGS.includes(language) ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("data-lang", language);
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
