import { StartupResponse } from "./startup";
import { UsuarioFull } from "./usuario";


export interface AllAvaliacaoResponse{
    id_avaliacao:number;
    nota:number;
    comentario?:string;
    links:{
        self: string;
    }
}

export interface AvaliacaoResponse{
    id_avaliacao:number;
    nota:number;
    comentario?:string;
    UsuarioCPF?:UsuarioFull["cpf"];
    Usuario:UsuarioFull;
    StartupCNPJ:StartupResponse["cnpj"];
}
