'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './i18n';

export type Lang = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations['zh-TW'];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh-TW');

  // Load from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved && translations[saved]) {
      setTimeout(() => setLangState(saved), 0);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  const t = translations[lang] || translations['zh-TW'];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
