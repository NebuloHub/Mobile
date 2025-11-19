import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

// Definição das cores dos temas
export const themeColors = {
  light: {
    background: '#fff',
    text: '#000',
    button: '#007bff',
    buttonText: '#fff',
    border: '#000',
    titulo: '#fff',
    popUp: '#E4E4E4FF',
  },
  dark: {
    background: '#373737',
    text: '#fff',
    button: '#0bf359ff',
    buttonText: '#000',
    border: '#fff',
    titulo: '#373737',
    popUp: '#272727',
  },
};

// Tipo do contexto
type ThemeContextType = {
  theme: ColorSchemeName;
  colors: typeof themeColors.light;
  toggleTheme: () => void;
};

// Cria o contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemScheme = useColorScheme(); 
  const [theme, setTheme] = useState<ColorSchemeName>(systemScheme || 'light');

  useEffect(() => {
    if (!theme || theme === systemScheme) return;
    setTheme(systemScheme || 'light');
  }, [systemScheme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? themeColors.light : themeColors.dark;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro do ThemeProvider');
  return context;
};
