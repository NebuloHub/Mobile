import { View, Text } from "react-native";
import { t, type Lang } from "../i18n";
import { useLanguage } from "../context/LanguageContext";


export function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; 
}

export default function PasswordStrengthBar({ score }: { score: number }) {

  const { lang } = useLanguage();
  
  const getColor = () => {
    if (score <= 1) return "red";
    if (score === 2) return "orange";
    if (score === 3) return "yellow";
    if (score === 4) return "lightgreen";
    return "green";
  };

  const getLabel = () => {
    if (score <= 1) return t("components.passwordStrength.level1");
    if (score === 2) return t("components.passwordStrength.level2");
    if (score === 3) return t("components.passwordStrength.level3");
    if (score === 4) return t("components.passwordStrength.level4");
    return t("components.passwordStrength.level5");
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
