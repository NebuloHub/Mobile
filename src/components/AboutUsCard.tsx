import React from "react";
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AboutUsCardProps } from "../types/aboutUsCard";

import { useTheme } from "../context/ThemeContext";
import { globalStyles } from "../styles/global";

export default function AboutUsCard({
  image,
  name,
  rm,
  turma,
  githubUrl,
  linkedinUrl,
}: AboutUsCardProps) {

  const { colors } = useTheme();
  const styles = globalStyles(colors);

  return (
    <View style={[styles.stars, {marginBottom:50}]}>
      <View style={styles.imageCardSobre}>
        <Image source={image} resizeMode="cover" />
      </View>

      <View style={styles.infoCardSobre}>

        <View style={{gap:5}}>
          <Text style={[styles.textButton, {fontWeight: "bold"}]}>{name}</Text>
          <Text style={styles.dadosStartup}>RM {rm}</Text>
          <Text style={styles.dadosStartup}>{turma}</Text>
        </View>



        <View style={[styles.stars, {gap:40}]}>
          <TouchableOpacity onPress={() => Linking.openURL(githubUrl)}>
            <Ionicons name="logo-github" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(linkedinUrl)}>
            <Ionicons name="logo-linkedin" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}