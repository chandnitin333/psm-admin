import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FloorService {

  constructor(private api: ApiService) { }

  getFloorList(params: any) {
    return this.api.post(`get-floor-list`, params);
  }



}
