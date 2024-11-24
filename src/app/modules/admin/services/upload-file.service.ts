import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private api: ApiService) { }

  fetchFileList(params: any) {
    return this.api.post('get-upload-file-list', params);
  }

  getFileListById(id: number) {
    return this.api.get('get-upload-file/' + id);
  }

  deleteFile(id: number) {
    return this.api.delete('delete-upload-file/' + id);
  }
}
