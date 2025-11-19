// src/api/api.ts
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

function resolveBaseURL() {
  // EXPO: tenta pegar o host da rede (ex: 192.168.10.158:8081)
  const expoHost = Constants.expoConfig?.hostUri;

  if (expoHost) {
    const ip = expoHost.split(":")[0];
    console.log("[API DEBUG] IP detectado pelo Expo:", ip);
    return `http://${ip}:5101/api/v2`;
  }

  console.log("[API DEBUG] Expo NÃO retornou hostUri");

  // ANDROID EMULATOR (não é o seu caso)
  if (Platform.OS === "android") {
    console.log("[API DEBUG] Fallback: 10.0.2.2 (Emulador)");
    return "http://10.0.2.2:5101/api/v2";
  }

  // iOS SIMULATOR
  return "http://localhost:5101/api/v2";
}

const BASE_URL = resolveBaseURL();
console.log("[API DEBUG] baseURL FINAL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token global
let authToken: string | null = null;

export const setToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use((config) => {
  const isPublic =
    config.url?.includes("/Auth/login") ||
    config.url?.includes("/usuarios/register");

  if (!isPublic && authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export default api;