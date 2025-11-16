import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import i18n, { setLocale, type Lang } from "../i18n";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};

// Define o contexto com valor padrão
export const LanguageContext = createContext<LanguageContextType>({
  lang: "pt",
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Estado inicial baseado no idioma do i18n
  const [lang, setLangState] = useState<Lang>(
    i18n.locale.startsWith("es")
      ? "es"
      : i18n.locale.startsWith("en")
      ? "en"
      : "pt"
  );

  // Carrega idioma salvo no AsyncStorage
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

  // Função para alterar idioma
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    setLocale(l);
    AsyncStorage.setItem("lang", l).catch(() => {});
  }, []);

  // Função para alternar idioma ciclando entre pt -> en -> es -> pt...
  const toggleLang = useCallback(() => {
    const nextLang: Lang = lang === "pt" ? "en" : lang === "en" ? "es" : "pt";
    setLang(nextLang);
  }, [lang, setLang]);

  const value = useMemo(
    () => ({ lang, setLang, toggleLang }),
    [lang, setLang, toggleLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
