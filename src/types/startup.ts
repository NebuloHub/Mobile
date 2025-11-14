import { Usuario } from "./usuario";

export interface Startup {
  CNPJ: string;
  Video?: string;
  Nome_startup: string;
  Site?: string;
  Descricao?: string;
  Nome_responsavel: string;
  Email_startup: string;
  Usuario: Usuario; 
}
