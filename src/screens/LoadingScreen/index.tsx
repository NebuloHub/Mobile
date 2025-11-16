// src/screens/LoadingScreen.tsx
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  }
});
