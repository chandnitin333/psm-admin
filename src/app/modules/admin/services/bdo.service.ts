import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BdoService {

  constructor(private api: ApiService) { }

  fetchBdoUserList(params: any) {
    return this.api.post(`get-bdo-user-list`, params);
  }
}
