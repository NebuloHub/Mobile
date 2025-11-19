import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface FieldProps {
  label?: string;
  error?: string | boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  required?: boolean;
}

export default function Field({ label, error, children, style, required }: FieldProps) {
  return (
    <View style={[styles.container, style]}>
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 6,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
  },
});
