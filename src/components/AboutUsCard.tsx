import React from "react";
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AboutUsCardProps } from "../types/aboutUsCard";

export default function AboutUsCard({
  image,
  name,
  rm,
  turma,
  githubUrl,
  linkedinUrl,
}: AboutUsCardProps) {
  return (
    <View>
      <View>
        <Image source={image} resizeMode="cover" />
      </View>

      <View>
        <Text>{name}</Text>
        <Text>RM {rm}</Text>
        <Text>{turma}</Text>

        <View>
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