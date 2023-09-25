import {axios}  from 'boot/axios'
import {UsuariService} from "src/service/UsuariService";
import {Calendari} from "src/model/google/Calendari";

export class CentreService {
  static async isSincronitzant(): Promise<Boolean> {
    try {
      const response = await axios.post(process.env.API + '/api/core/public/centre/sincronitzant');
      const data: any = await response.data;
      return data
    } catch (e:any){
      return false;
    }
  }
}
