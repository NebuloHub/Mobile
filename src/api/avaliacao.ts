import api from "./api";
import { AvaliacaoRequest, AvaliacaoResponse } from "../types/avaliacao";

export async function getAvaliacaoByID(id:AvaliacaoResponse['idAvaliacao']): Promise<AvaliacaoResponse> {
    const res = await api.get(`/Avaliacao/${id}`);
    return res.data;
}

export async function postAvaliacao(data:AvaliacaoRequest): Promise<AvaliacaoResponse> {
    const res = await api.post("/Avaliacao", data)
    return res.data   
}