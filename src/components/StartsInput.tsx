import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StarsInput({
  rating,
  setRating,
  max = 10,
}: {
  rating: number;
  setRating: (value: number) => void;
  max?: number;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < rating;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => setRating(i + 1)}
            style={{ padding: 4 }}
          >
            <Ionicons
              name={filled ? "star" : "star-outline"}
              size={22}
              color="#FFD700"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
