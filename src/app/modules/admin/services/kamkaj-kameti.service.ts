import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class KamkajKametiService {

  constructor(private api: ApiService) { }

  fetchKamkajKamethiList(params:any){
    return  this.api.post(`get-member-list`, params)
  }

  fetchDistrict() {
    return this.api.get('get-panchayat-users')
  }
}
