import api from "./api";
import {
  HabilidadeResquest,
  HabilidadeResponse,
  HabilidadeListResponse,
} from "../types/habilidade";

export async function getAllHabilidades(
  page = 1,
  pageSize = 20
): Promise<HabilidadeListResponse> {
  try {
    const res = await api.get(`/Habilidade?page=${page}&pageSize=${pageSize}`);

    if (!res.data.items || !Array.isArray(res.data.items)) {
      return {
        page: res.data.page ?? 1,
        pageSize: res.data.pageSize ?? 20,
        totalItems: res.data.totalItems ?? 0,
        items: [],
      };
    }

    return res.data;
  } catch (err: any) {
    throw err;
  }
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
