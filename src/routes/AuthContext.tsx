import { createContext, useContext, useState, ReactNode } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';

type AuthContextType = {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);

  const login = (userData: any) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
