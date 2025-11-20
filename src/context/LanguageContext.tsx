import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";

import i18n, { setLocale, type Lang } from "../i18n";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};

// Contexto
export const LanguageContext = createContext<LanguageContextType>({
  lang: "pt",
  setLang: () => {},
  toggleLang: () => {},
});

// Provider
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    i18n.locale.startsWith("es")
      ? "es"
      : i18n.locale.startsWith("en")
      ? "en"
      : "pt"
  );

  // Carrega idioma salvo
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("lang");
        if (saved === "pt" || saved === "es" || saved === "en") {
          setLangState(saved);
          setLocale(saved);
        }
      } catch {}
    })();
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    setLocale(l);
    AsyncStorage.setItem("lang", l).catch(() => {});
  }, []);

  const toggleLang = useCallback(() => {
    const nextLang: Lang = lang === "pt" ? "en" : lang === "en" ? "es" : "pt";
    setLang(nextLang);
  }, [lang, setLang]);

  const value = useMemo(() => ({ lang, setLang, toggleLang }), [lang, setLang, toggleLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// ✅ Hook para usar o contexto em qualquer componente
export const useLanguage = () => useContext(LanguageContext);
