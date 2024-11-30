import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../constants/admin.constant';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  constructor(private http: HttpClient) { }

  getDistrictList<T>(params: any) {

    return this.http.post<T>(`${API_URL}${'district-list'}`, params);
  }

  getDistrict<T>(id: number) {

    return this.http.get<T>(`${API_URL}${'district-list'}`);
  }

  createDistrict<T>(params: any) {
  
    return this.http.post<T>(`${API_URL}${'district'}`, params);
  }

  UpdateDistrict<T>(params: any) {
    return this.http.put<T>(`${API_URL}${'update-district'}`, params);
  }

  deleteDistrict<T>(id: number) {
    return this.http.delete<T>(`${API_URL}${'district/'}` + id);
  }
}
