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

    addBDOUser(params: any) {
        return this.api.post(`add-bdo-user`, params);
    }

    updateUser(params: any) {
        return this.api.put(`update-bdo-user`, params);
    }

    getUserId(id: number) {
        return this.api.get(`get-bdo-user-by-id/${id}`);
    }
    deleteUser(id: number) {
        return this.api.delete(`delete-bdo-user/${id}`);
    }
}
