import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GhasaraRatesService {

  constructor(private api: ApiService) { }

  getGhasaraList(params: any) {
    return this.api.post(`get-ghasara-dar-list`, params);
  }
}
