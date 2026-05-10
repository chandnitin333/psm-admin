import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GramPanchayatService {

  constructor(private api: ApiService) { }

  getTalukaById(params: any) {
    return this.api.post(`taluka-list-by-district-id`, params);
  }

  createGramPanchayat(params: FormData) {
    return this.api.postFormData(`gram-panchayat`, params);
  }

  updateGramPanchayat(params: FormData) {
    return this.api.putFormData(`update-gram-panchayat`, params);
  }

  deleteGramPanchayat(id: any) {
    return this.api.delete(`gram-panchayat/${id}`);
  }

  getGramPanchayatList(params: any) {
    return this.api.post(`gram-panchayat-list`, params);
  }


  getGramPanchayatById(id: any) {
    return this.api.get(`get-gram-panchayat/${id}`);
  }
}
