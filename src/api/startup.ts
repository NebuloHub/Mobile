import api from "./api";
import { AllStartupsResponse, StartupResponse } from "../types/startup";

export async function getAllStartups(): Promise<AllStartupsResponse[]> {
  const res = await api.get("/Startup");
  return res.data.items; 
}


export async function getStartupByCNPJ(cnpj: StartupResponse["cnpj"]): Promise<StartupResponse> {
  const res = await api.get(`/Startup/${cnpj}`);
  return res.data;
}
