import { AvaliacaoResponse } from "./avaliacao";
import { Habilidade } from "./habilidade";
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
  habilidades:Habilidade[];
  avaliacoes:AvaliacaoResponse[];
}

export interface StartupDetailsParams {
  cnpj: StartupResponse["cnpj"];
}