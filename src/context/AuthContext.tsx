import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setToken as setAxiosToken } from "../api/api";
import { login, register } from "../api/service";
import {
  LoginRequest,
  LoginResponse,
  UsuarioAuth,
  UserResponse,
} from "../types/usuario";

interface AuthContextData {
  user: UsuarioAuth | null;
  token: string | null;
  loading: boolean;
  signIn: (data: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: UserResponse) => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UsuarioAuth | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorage = async () => {
      try {
        const storagedToken = await AsyncStorage.getItem("@token");
        const storagedUser = await AsyncStorage.getItem("@user");

        if (storagedToken && storagedUser) {
          setAxiosToken(storagedToken);
          setToken(storagedToken);
          setUser(JSON.parse(storagedUser));
        }
      } catch (error) {
        console.log("Erro ao carregar storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStorage();
  }, []);

  // LOGIN
  const signIn = async ({ email, senha }: LoginRequest) => {
    const response: LoginResponse = await login({ email, senha });

    const authUser = response.usuario;
    const authToken = response.token;

    setAxiosToken(authToken);
    setToken(authToken);
    setUser(authUser);

    await AsyncStorage.setItem("@token", authToken);
    await AsyncStorage.setItem("@user", JSON.stringify(authUser));
  };

  // LOGOUT
  const signOut = async () => {
    setUser(null);
    setToken(null);
    setAxiosToken(null);
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@user");
  };

  // CADASTRO
  const signUp = async (data: UserResponse) => {
    try {
      const resp = await register(data);
      return resp; // se precisar usar depois
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Erro ao cadastrar usuário";

      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};
