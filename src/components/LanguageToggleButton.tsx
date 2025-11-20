import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";
import { globalStyles } from "../styles/global";
import { t, type Lang } from "../i18n";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);

  const { colors } = useTheme();
  const styles = globalStyles(colors);

  const { lang, setLang } = useLanguage();

  const langs: { code: Lang; label: string }[] = [
    { code: "pt", label: t("components.language.titleOptionPT") },
    { code: "en", label: t("components.language.titleOptionEN") },
    { code: "es", label: t("components.language.titleOptionES") },
  ];

  const changeLanguage = (newLang: Lang) => {
    if (newLang !== lang) {
      setLang(newLang);
    }
    setOpen(false);
  };

  return (
    <View style={styles.corpoLinguagem}>
      <TouchableOpacity
        style={styles.linguagem}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.textLinguagem}>{t("components.language.titleLanguage")}</Text>
        <Ionicons name="chevron-down-outline" size={24} style={styles.olho} />
      </TouchableOpacity>

      {open && (
        <View style={styles.caixaLinguagem}>
          {langs.map((l) => (
            <TouchableOpacity key={l.code} onPress={() => changeLanguage(l.code)}>
              <Text style={styles.textLinguagem}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
