import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

import { useTheme } from "../context/ThemeContext";
import { globalStyles } from "../styles/global";

interface FieldProps {
  label?: string;
  error?: string | boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  required?: boolean;
}

export default function Field({ label, error, children, style, required }: FieldProps) {

  const { colors } = useTheme();
  const styles = globalStyles(colors);


  return (
    <View style={[styles.caixa, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={{ color: "red" }}> *</Text>}
        </Text>
      )}

      {children}

      {error ? (
        <Text style={styles.errorText}>
          {typeof error === "string" ? error : "Campo inválido"}
        </Text>
      ) : null}
    </View>
  );
}


