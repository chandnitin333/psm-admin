import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SachiveImagesService {

  constructor(private api: ApiService) { }

  fetchSachiveImagesList(params: any) {
    return this.api.post('get-dashboard-data-list', params);
  }

  getSachiveImagesById(id: number) {
    return this.api.get('get-dashboard-data/' + id,);
  }


  deleteSachiveImagesById(id: number) {
    return this.api.delete('delete-dashboard-data/' + id);
  }

}
