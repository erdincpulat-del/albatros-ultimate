"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { tr } from "@/messages/tr";
import { en } from "@/messages/en";

type Locale = "tr" | "en";
type Messages = typeof tr;

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>("tr");

  const t = useMemo(() => {
    return locale === "tr" ? tr : en;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}