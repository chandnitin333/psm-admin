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


  addFloor(params: any) {
    return this.api.post(`floor`, params);
  }

  updateFloor(params: any) {
    return this.api.put(`update-floor`, params);
  }

  getFloorById(id: number) {
    return this.api.get(`floor/${id}`);
  }
  deleteFloor(id: number) {
    return this.api.delete(`delete-floor/${id}`);
  }
}
