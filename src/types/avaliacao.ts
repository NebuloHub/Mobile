import { StartupResponse } from "./startup";
import { UserResponse } from "./usuario";

export interface AllAvaliacaoResponse{
    idAvaliacao:number;
    nota:number;
    comentario?:string;
    links:{
        self: string;
    }
}

export interface AvaliacaoResponse{
    idAvaliacao:number;
    nota:number;
    comentario:string;
    usuarioCPF?:UserResponse["cpf"];
    usuario?:UserResponse;
    startupCNPJ?:StartupResponse["cnpj"];
}

export interface AvaliacaoRequest{
    nota: number;
    comentario:string;
    usuarioCPF:UserResponse['cpf'];
    startupCNPJ:StartupResponse['cnpj'];
}

