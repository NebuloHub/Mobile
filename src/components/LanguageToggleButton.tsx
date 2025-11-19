import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import i18n, { setLocale } from "../i18n";
import { t } from '../i18n'

import { globalStyles } from "../styles/global";

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);

  const styles = globalStyles;


  const langs = [
    { code: "pt", label: "Português (BR)" },
    { code: "en", label: "Inglês (US)" },
    { code: "es", label: "Espanhol" },
  ];

  const changeLanguage = (lang: string) => {
    setLocale(lang as any)
    setOpen(false);
  };

  return (
    <View style={styles.corpoLinguagem}>
      <TouchableOpacity style={styles.linguagem} onPress={() => setOpen(!open)}>
        <Text style={styles.textLinguagem}>{t('components.titleLanguage')}</Text>
        <Ionicons
            name="chevron-down-outline"
            size={24}
            style={styles.olho}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.caixaLinguagem}>
          {langs.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text style={styles.textLinguagem}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}