import * as Localization from 'expo-localization';
import { I18n, type TranslateOptions } from 'i18n-js';
import pt from './pt.json';
import en from './en.json';
import es from './es.json';

// Criando o objeto i18n com todos os idiomas
export const i18n = new I18n({ pt, en, es });
i18n.enableFallback = true; // fallback para o idioma padrão se a chave não existir

// Detecta o idioma do dispositivo
const deviceLang = (Localization.getLocales?.() ?? [])[0]?.languageCode ?? 'en';

// Define o idioma inicial (pt, en ou es)
if (deviceLang.startsWith('pt')) i18n.locale = 'pt';
else if (deviceLang.startsWith('es')) i18n.locale = 'es';
else i18n.locale = 'en';

export type Lang = 'pt' | 'en' | 'es';

// Função para trocar o idioma manualmente
export function setLocale(lang: Lang) {
  i18n.locale = lang;
}

// Função de tradução
export const t = (key: string, options?: TranslateOptions) => i18n.t(key, options);

export default i18n;
