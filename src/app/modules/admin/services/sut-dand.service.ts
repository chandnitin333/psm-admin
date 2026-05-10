import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({ providedIn: 'root' })
export class SutDandService {
    constructor(private api: ApiService) { }

    list(params: any) {
        return this.api.post('sut-dand-list', params);
    }

    create(params: any) {
        return this.api.post('sut-dand', params);
    }

    getById(id: number) {
        return this.api.get(`sut-dand/${id}`);
    }

    update(id: number, params: any) {
        return this.api.put(`sut-dand/${id}`, params);
    }

    delete(id: number) {
        return this.api.delete(`sut-dand/${id}`);
    }
}
