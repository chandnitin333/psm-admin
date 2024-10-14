import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { API_URL } from '../constants/admin.constant';

@Injectable({
  providedIn: 'root'
})
export class TalukaService {

  constructor(private api: ApiService) { }

  getTalukas(params: any) {
    return this.api.post(API_URL, params);
  }

  getDistrictDDL(){
    return this.api.get(API_URL);
  }

 createTaluka(params: any) {
    return this.api.post(API_URL, params);
  }

  UpdateTaluka(params: any) {
    return this.api.put(API_URL, params);
  }

  deleteTaluka(id: number){
    return this.api.delete(API_URL+id);
  }
}
