import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SachiveImagesService {

  constructor(private api :ApiService) { }

  fetchSachiveImagesList(params: any) {
    return this.api.post('get-dashboard-data-list', params);
  }

}
