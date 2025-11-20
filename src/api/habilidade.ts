import api from "./api";
import {
  AllHabilidadeResponse,
  HabilidadeResquest,
  HabilidadeResponse,
} from "../types/habilidade";

interface HabilidadeListResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  items: AllHabilidadeResponse[];
}

export async function getAllHabilidades(
  page = 1,
  pageSize = 100
): Promise<HabilidadeListResponse> {
  const res = await api.get(
    `/Habilidade?page=${page}&pageSize=${pageSize}`
  );
  return res.data;
}

export async function getHabilidadeById(
  id: number
): Promise<HabilidadeResponse> {
  const res = await api.get(`/Habilidade/${id}`);
  return res.data;
}

export async function postHabilidade(
  data: HabilidadeResquest
): Promise<HabilidadeResponse> {
  const res = await api.post("/Habilidade", data);
  return res.data;
}
