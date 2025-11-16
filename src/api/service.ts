// src/api/auth.service.ts
import api from './api';
import { UsuarioModel,LoginRequest, LoginResponse } from '../types/usuario';


export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/Auth/login', data);
  return response.data;
};

export const register = async (data: UsuarioModel) => {
  const response = await api.post("/Usuario", data);
  return response.data; 
};