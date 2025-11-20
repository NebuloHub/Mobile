import { StartupResponse } from "./startup";
import { HabilidadeResponse } from "./habilidade";

export interface PossuiResponse {
  idPossui: number;
  startup: StartupResponse;
  habilidade: HabilidadeResponse;
}

export interface PossuiRequest {
  startupCNPJ: string;
  idHabilidade: number;
}

export interface PossuiListResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  items: {
    idPossui: number;
    links: {
      self: string;
    };
  }[];
}
