import React from "react";
import { View, Text, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { globalStyles } from "../styles/global";
import { t } from "../i18n";
import { useLanguage } from "../context/LanguageContext";

interface FieldProps {
  labelKey?: string;          
  error?: string | boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  required?: boolean;
}

export default function Field({
  labelKey,
  error,
  children,
  style,
  required,
}: FieldProps) {
  const { colors } = useTheme();
  const styles = globalStyles(colors);

  const { lang } = useLanguage(); 

  return (
    <View style={[styles.caixa, style]}>
      {labelKey && (
        <Text style={styles.label}>
          {t(labelKey)}
          {required && <Text style={{ color: "red" }}> *</Text>}
        </Text>
      )}

      {children}

      {error ? (
        <Text style={styles.errorText}>
          {typeof error === "string" ? error : t("fields.defaultError")}
        </Text>
      ) : null}
    </View>
  );
}
