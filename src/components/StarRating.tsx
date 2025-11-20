import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StarRatingProps {
  rating: number;
  setRating: (n: number) => void;
  max?: number;
}

export default function StarRating({ rating, setRating, max = 10 }: StarRatingProps) {
  return (
    <View style={{ flexDirection: "row", marginVertical: 10, flexWrap: "wrap" }}>
      {[...Array(max)].map((_, i) => {
        const filled = i < rating;

        return (
          <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
            <Ionicons
              name={filled ? "star" : "star-outline"}
              size={30}
              style={{ margin: 2 }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
