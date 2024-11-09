import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PrakarService {

  constructor(private api:ApiService) { }

  fetchPrakarList(params:any){

    return this.api.post('get-prakar-list',params);
  }
}
