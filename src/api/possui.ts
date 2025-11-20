import api from "./api";
import { PossuiResponse } from "../types/possui";

export async function getPossuiById(id: number): Promise<PossuiResponse> {
  const response = await api.get(`/Possui/${id}`);
  return response.data;
}

// Lista todos os Possui e depois filtra por startup
export async function getPossuiByStartup(cnpj: string): Promise<PossuiResponse[]> {
  const response = await api.get("/Possui");
  const list: { items: { idPossui: number }[] } = response.data;

  const detalhes = await Promise.all(
    list.items.map(async (item) => {
      const d = await getPossuiById(item.idPossui);
      return d;
    })
  );

  return detalhes.filter((p) => p.startup.cnpj === cnpj);
}

export async function createPossui(startupCNPJ: string, idHabilidade: number) {
  return api.post("/Possui", {
    startupCNPJ,
    idHabilidade
  });
}

export async function deletePossui(id: number) {
  return api.delete(`/Possui/${id}`);
}
