import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StarsDisplay({
  value,
  size = 18,
}: {
  value: number;
  size?: number;
}) {
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= full)
      stars.push(<Ionicons key={i} name="star" size={size} color="#FFD700" />);
    else if (i === full + 1 && half)
      stars.push(
        <Ionicons key={i} name="star-half" size={size} color="#FFD700" />
      );
    else
      stars.push(
        <Ionicons key={i} name="star-outline" size={size} color="#FFD700" />
      );
  }

  return <View style={{ flexDirection: "row" }}>{stars}</View>;
}
