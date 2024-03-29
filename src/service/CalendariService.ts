import {axios}  from 'boot/axios'
import {UsuariService} from "src/service/UsuariService";
import {Calendari} from "src/model/google/Calendari";
import {GrupCorreuService} from "src/service/GrupCorreuService";

export class CalendariService {
  static async getCalendariByEmail(email:string): Promise<Calendari> {
    const response = await axios.get(process.env.API + '/api/core/calendari/findByEmail/' + email);
    const data:any = await response.data;
    return this.fromJSON(data)
  }

  static async getCalendaris(): Promise<Array<Calendari>> {
    const response = await axios.get(process.env.API + '/api/core/calendari/llistat');
    const data = await response.data;
    return data.map((calendari:any):Calendari=>{
        return this.fromJSON(calendari)
    });
  }

  static fromJSON(json:any):Calendari{
    return {
      id: json.idcalendari,
      email: json.gsuiteEmail,
      nom: json.gsuiteNom,
      descripcio: json.gsuiteDescripcio,
      tipus: json.calendariTipus,
      usuarisLectura: (json.usuarisLectura)?json.usuarisLectura.map((u:any)=>UsuariService.fromJSON(u)):undefined,
      usuarisEdicio: (json.usuarisEdicio)?json.usuarisEdicio.map((u:any)=>UsuariService.fromJSON(u)):undefined,
      grupCorreuLectura: (json.grupCorreuLectura)?json.grupCorreuLectura.map((u:any)=>GrupCorreuService.fromJSON(u)):undefined,
      grupCorreuEdicio: (json.grupCorreuEdicio)?json.grupCorreuEdicio.map((u:any)=>GrupCorreuService.fromJSON(u)):undefined,
      label: json.gsuiteNom,
      value: json.idcalendari
    }
  }
}
