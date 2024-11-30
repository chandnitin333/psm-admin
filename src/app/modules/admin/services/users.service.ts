import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private api: ApiService) { }

  getGatGramPanchayt(id: number) {
    return this.api.post(`gat-gram-panchayat-list-by-panchayat-id/`, { id: id });
  }

  addUsers(params: any) {
    return this.api.post(`add-new-user`, params)
  }
  getUserDistrict(params:any) {
    return this.api.post('get-user-district',params)
  }

  getAllUserList(params: any) {
    return this.api.post('get-all-user-list', params)
  }

  getUserById(params: any) {
    return this.api.post(`get-user-by-id`, params)
  }
  updateUser(params: any) {
    return this.api.put(`update-user`, params)
  }

  deleteUser(params: any) {
    return this.api.put(`delete-user-by-id`, params)
  }
}
