import {Grup} from "src/model/gestib/Grup";

export interface Curs {
  id: number;
  nom: string;
  grups?: Grup[];
}
