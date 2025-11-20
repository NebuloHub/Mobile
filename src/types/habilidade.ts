export interface AllHabilidadeResponse {
  idHabilidade: number;
  nomeHabilidade: string;
  tipoHabilidade: string;
  links:{
    self: string;
  }
}

export interface HabilidadeResponse {
  idHabilidade: number;
  nomeHabilidade: string;
  tipoHabilidade: string;
}

export interface HabilidadeListResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  items: AllHabilidadeResponse[];
}

export interface HabilidadeResquest{
  nomeHabilidade: string;
  tipoHabilidade: string;
}
