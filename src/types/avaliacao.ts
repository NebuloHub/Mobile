import { Startup } from "./startup";
import { Usuario } from "./usuario";

export interface Avaliacao{
    id_avaliacao:number;
    nota:number;
    Comentário?:string;
    Usuario:Usuario;
    Startup:Startup;
}