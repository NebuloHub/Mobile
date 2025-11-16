// src/types/auth.types.ts

export interface UsuarioModel {
  CPF: string;
  Nome: string;
  Email: string;
  Senha: string;
  Role: string;
  Telefone?: number;
}

// Formato que a API usa no login
export interface LoginRequest {
  email: string;
  senha: string;
}

// Formato de usuário retornado pela API no login
export interface UsuarioAuth {
  nome: string;
  email: string;
  role: string;
}

// Resposta do login
export interface LoginResponse {
  token: string;
  usuario: UsuarioAuth;
}
