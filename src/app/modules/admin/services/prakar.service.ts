import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PrakarService {

  constructor(private api: ApiService) { }

  fetchPrakarList(params: any) {

    return this.api.post('get-prakar-list', params);
  }

  addPrakar(params: any) {
    return this.api.post(`prakar`, params);
  }
  updatePrakar(params: any) {
    return this.api.put(`update-prakar`, params);
  }
  deletePrakar(id: number) {
    return this.api.delete(`delete-prakar/${id}`);
  }

  getPrakarById(id: number) {
    return this.api.get(`prakar/${id}`);
  }
}
