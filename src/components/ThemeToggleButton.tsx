import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext"; 

export default function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme(); 
  const isDark = theme === "dark";

  return (
    <TouchableOpacity onPress={toggleTheme} style={{ padding: 10 }}>
      <Ionicons
        name={isDark ? "sunny-outline" : "moon-outline"}
        size={28}
        color={isDark ? "#FFD700" : colors.text} 
      />
    </TouchableOpacity>
  );
}
