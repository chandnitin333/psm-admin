import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AnualTaxService {

  constructor(private api: ApiService) { }

  getAnualTaxList(params: any) {
    return this.api.post('get-annual-tax-list', params);
  }

  getDistrictList() {
    return this.api.post('get-annual-get-district', {});
  }

  getAnualTaxDetailsByDistrict(params: any) {
    return this.api.post('get-annual-tax-list-by-district', params);
  }
}
