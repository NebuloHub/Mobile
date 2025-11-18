import { StartupResponse } from "./startup";

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface UsuarioAuth {
  nome: string;
  email: string;
  role: string;
  cpf: string;
}

export interface AllUsersResponse {
  cpf: string;
  nome: string;
  email: string;
  links: {
    self: string;
  };
}

export interface UserResponse {
  cpf: string;
  nome: string;
  email: string;
  senha?: string; 
  role: "USER" | "ADMIN" | string;
  telefone?: number;
  startups?: StartupResponse[]; 
}

// Resposta do endpoint de login
export interface LoginResponse {
  token: string;
  usuario: UsuarioAuth;
}