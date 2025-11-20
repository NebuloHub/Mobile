import { AvaliacaoResponse } from "./avaliacao";
import { HabilidadeResponse } from "./habilidade";
import { UserResponse } from "./usuario";


export interface AllStartupsResponse {
  cnpj: string;
  nomeStartup: string;
  video?: string;
  emailStartup: string;
  links: {
    self: string;
  };
}

export interface StartupResponse{
  cnpj: string;
  video?: string;
  nomeStartup: string;
  site:string;
  descricao:string;
  nomeResponsavel:UserResponse["nome"];
  emailStartup: string;
  usuarioCPF:UserResponse["cpf"];
  habilidades:HabilidadeResponse[];
  avaliacoes:AvaliacaoResponse[];
}

export interface StartupRequest{
  cnpj: string;
  video?: string;
  nomeStartup:string;
  site:string;
  descricao:string;
  nomeResponsavel:string;
  emailStartup:string;
  usuarioCPF:string;
}

export interface StartupDetailsParams {
  cnpj: StartupResponse["cnpj"];
}