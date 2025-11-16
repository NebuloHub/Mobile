import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import i18n, { setLocale } from "../i18n";
import { t } from '../i18n'

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);

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
    <View >
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text>{t('components.titleLanguage')}</Text>
        <Ionicons
            name="chevron-down-outline"
            size={24}
        />
      </TouchableOpacity>

      {open && (
        <View>
          {langs.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text>{lang.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}