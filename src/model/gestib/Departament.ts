import {Usuari} from "src/model/Usuari";

export interface Departament {
  id: number;
  nom: string;
  gestibId: string;
  capDepartament?: Usuari;
}
