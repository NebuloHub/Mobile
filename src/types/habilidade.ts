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

export interface HabilidadeResquest{
  nomeHabilidade: string;
  tipoHabilidade: string;
}
