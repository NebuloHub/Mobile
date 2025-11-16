import { View, Text } from "react-native";

export function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0–5
}

export default function PasswordStrengthBar({ score }: { score: number }) {
  const getColor = () => {
    if (score <= 1) return "red";
    if (score === 2) return "orange";
    if (score === 3) return "yellow";
    if (score === 4) return "lightgreen";
    return "green";
  };

  const getLabel = () => {
    if (score <= 1) return "Senha muito fraca";
    if (score === 2) return "Senha fraca";
    if (score === 3) return "Senha média";
    if (score === 4) return "Senha forte";
    return "Senha muito forte";
  };

  return (
    <View style={{ width: "100%", marginBottom: 10 }}>
      <View
        style={{
          height: 8,
          width: `${(score / 5) * 100}%`,
          backgroundColor: getColor(),
          borderRadius: 4,
        }}
      />
      <Text style={{ marginTop: 4, color: getColor(), fontWeight: "bold" }}>
        {getLabel()}
      </Text>
    </View>
  );
}
