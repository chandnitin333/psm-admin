import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TalukaService {

  constructor(private api: ApiService) { }

  getTalukas(url: string, params: any) {
    return this.api.post(`${url}`, params);
  }

  async getDistrictDDL(url: string) {
    try {
      const res: any = await this.api.post(`${url}`, {}).toPromise();
      return res?.data ?? [];
    } catch (err) {
      console.error('Error getting districts:', err);
      return [];
    }
  }

  createTaluka(url: string, params: any) {
    return this.api.post(url, params);
  }

  UpdateTaluka(url: string, params: any) {
    return this.api.put(`${url}`, params);
  }

  deleteTaluka(url: string) {
    return this.api.delete(url);
  }
}
