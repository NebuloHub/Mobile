import { Habilidade } from './habilidade';
import { Startup } from "./startup";

export interface Possui{
    id_possui:number;
    Startup:Startup;
    Habilidade:Habilidade;
}