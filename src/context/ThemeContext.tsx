import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const themeColors = {
  light: {
    background: '#fff',
    text: '#000',
    buttonText: '#fff',
    titulo: '#000000',
    borda: '#000000',
  },
  dark: {
    background: '#212121',
    text: '#5D5D5D',
    buttonText: '#ffffff',
    titulo: '#FFFBFBFF',
    borda: '#5D5D5D',
  },
};

type ThemeContextType = {
  theme: ColorSchemeName;
  colors: typeof themeColors.light;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

const STORAGE_KEY = "@app_theme";

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<ColorSchemeName>(systemScheme || "light");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTheme === "light" || savedTheme === "dark") {
          setTheme(savedTheme);
        } else {
          setTheme(systemScheme || "light");
        }
      } catch (e) {
        setTheme(systemScheme || "light");
      } finally {
        setLoaded(true);
      }
    };
    loadTheme();
  }, [systemScheme]);

  useEffect(() => {
    if (!loaded) return;
    if (theme) {
      AsyncStorage.setItem(STORAGE_KEY, theme).catch((err) =>
        console.log("Erro ao salvar tema:", err)
      );
    }
  }, [theme, loaded]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = theme === "light" ? themeColors.light : themeColors.dark;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme deve ser usado dentro do ThemeProvider");
  return context;
};
