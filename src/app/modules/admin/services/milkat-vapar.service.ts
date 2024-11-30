import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MilkatVaparService {

  constructor(private api: ApiService) { }

  getMilkatVaparList(params: any) {
    return this.api.post(`get-milkat-vapar-list`, params);
  }
}
