import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MalamataPrakarService {

  constructor(private api: ApiService) { }

  getMilkatPrakar(params: any) {
    return this.api.post(`get-malmatteche-prakar-list`, params);
  }
}
