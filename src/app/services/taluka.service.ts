import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TalukaService {

  constructor(private api:ApiService) { }

  getTalukas(params:any) {
    return this.api.post('talukas',params);
  }
}
