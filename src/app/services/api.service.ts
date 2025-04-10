import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'http://103.102.234.151:4444/api/admin';
  constructor(private http: HttpClient) { }


  // GET request
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  // POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  // postFormData<T>(endpoint: string, formData: any): Observable<T> {
  //   return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData, {
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 409) {
        errorMessage = 'Conflict: The request could not be completed due to a conflict with the current state of the target resource.';
      }
    }
    return throwError(errorMessage);
  }

  // DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }



}
