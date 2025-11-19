import api from "./api";
import { AllUsersResponse, UserResponse } from "../types/usuario";

export async function getAllUsers(): Promise<AllUsersResponse[]> {
    const res = await api.get("/Usuario")
    return res.data.items;
}

export async function getUserByCPF(cpf:UserResponse["cpf"]): Promise<UserResponse> {
    const res = await api.get(`/Usuario/${cpf}`);
    return res.data;
}

export async function deleteUserByCPF(cpf: UserResponse["cpf"]): Promise<{ mensagem: string }> {
    const res = await api.delete(`/Usuario/${cpf}`);
    return res.data;
}