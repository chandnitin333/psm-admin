import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GatGramPanchayatService {

  constructor(private api: ApiService) { }



  getGatGramTalukaById(params: any) {
    return this.api.post(`panchayat-list-by-taluka-id`, params);
  }

  getGatGatGramPanchayatById(params: any) {
    return this.api.post(`gat-gram-panchayat-list-by-panchayat-id`, params);
  }

  createGatGramPanchayat(params: any) {
    return this.api.post(`gat-gram-panchayat`, params);
  }

  updateGatGramPanchayat(params: any) {
    return this.api.put(`update-gat-gram-panchayat`, params);
  }

  deleteGatGramPanchayat(id: any) {
    return this.api.delete(`gat-gram-panchayat/${id}`);
  }

  getGatGramPanchayatList(params: any) {
    return this.api.post(`gat-gram-panchayat-list`, params);
  }


  getGatGramPanchayatById(id: any) {
    return this.api.get(`get-gat-gram-panchayat/${id}`);
  }
}
