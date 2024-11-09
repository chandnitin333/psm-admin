import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BharankRatesService {

  constructor(private api :ApiService) { }

  fetchBharankRatesList(params: any) {
    return this.api.post(`get-bharank-dar-list`, params);
  }

}

