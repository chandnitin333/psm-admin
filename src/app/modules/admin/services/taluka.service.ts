import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { SERVICE_URL } from '../constants/admin.constant';

@Injectable({
  providedIn: 'root'
})
export class TalukaService {

  constructor(private api: ApiService) { }

  getTalukas(params: any) {
    return this.api.post(SERVICE_URL.GET_TALUKAS, params);
  }

  getDistrictDDL(){
    return this.api.get(SERVICE_URL.GET_DISTRICT_DDL);
  }

 createTaluka(params: any) {
    return this.api.post(SERVICE_URL.CREATE_TALUKA, params);
  }

  UpdateTaluka(params: any) {
    return this.api.put(SERVICE_URL.UPDATE_TALUKA, params);
  }

  deleteTaluka(id: number){
    return this.api.delete(SERVICE_URL.DELETE_TALUKA+id);
  }
}
