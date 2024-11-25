import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TowerService {

  constructor(private api: ApiService) { }

  getTowerList(params: any) {
    return this.api.post(`get-tower-list`, params)
  }

  addTower(params: any) {
    return this.api.post(`add-tower`, params)
  }

  updateTower(params: any) {
    return this.api.put(`update-tower`, params)
  }
  getTowerById(id: number) {
    return this.api.get(`tower-by-id/${id}`)
  }
  deleteTower(id: number) {
    return this.api.delete(`delete-tower/${id}`)
  }
}
