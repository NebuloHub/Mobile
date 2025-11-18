import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken as setAxiosToken } from "../api/api";
import { login, register } from "../api/service";
import { jwtDecode } from "jwt-decode";

import {
  LoginRequest,
  LoginResponse,
  UsuarioAuth,
  UserResponse,
} from "../types/usuario";

const SESSION_DURATION_MINUTES = 60;

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

  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  /**
   * 🔥 Agenda logout automático
   */
  const scheduleLogout = (expiresAt: number) => {
    const timeLeft = expiresAt - Date.now();

    if (timeLeft <= 0) {
      signOut();
      return;
    }

    if (logoutTimer) clearTimeout(logoutTimer);

    const timer = setTimeout(() => {
      console.log("Sessão expirada automaticamente.");
      signOut();
    }, timeLeft);

    setLogoutTimer(timer);
  };

  /**
   * 🔥 Inicializa estado com dados salvos
   */
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const storagedToken = await AsyncStorage.getItem("@token");
        const storagedUser = await AsyncStorage.getItem("@user");
        const storagedExpires = await AsyncStorage.getItem("@expiresAt");

        if (storagedToken && storagedUser && storagedExpires) {
          const expiresAt = Number(storagedExpires);

          if (expiresAt > Date.now()) {
            setAxiosToken(storagedToken);
            setToken(storagedToken);
            setUser(JSON.parse(storagedUser));

            scheduleLogout(expiresAt);
          } else {
            await signOut();
          }
        }
      } catch (error) {
        console.error("Erro ao carregar Storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStorage();
  }, []);

  /**
   * 🔥 Login — adicionando CPF vindo do token
   */
  const signIn = async ({ email, senha }: LoginRequest) => {
    const response: LoginResponse = await login({ email, senha });

    const authToken = response.token;

    const decoded: any = jwtDecode(authToken);

    const authUser: UsuarioAuth = {
      ...response.usuario,
      cpf: decoded.cpf, // vem do token
    };

    const expiresAt = Date.now() + SESSION_DURATION_MINUTES * 60 * 1000;

    setAxiosToken(authToken);
    setToken(authToken);
    setUser(authUser);

    await AsyncStorage.setItem("@token", authToken);
    await AsyncStorage.setItem("@user", JSON.stringify(authUser));
    await AsyncStorage.setItem("@expiresAt", expiresAt.toString());

    scheduleLogout(expiresAt);
  };

  /**
   * 🔥 Logout
   */
  const signOut = async () => {
    setUser(null);
    setToken(null);
    setAxiosToken(null);

    if (logoutTimer) clearTimeout(logoutTimer);

    await AsyncStorage.multiRemove(["@token", "@user", "@expiresAt"]);
  };

  const signUp = async (data: UserResponse) => {
    try {
      return await register(data);
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

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};