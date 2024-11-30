import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommanTypeService {
  private baseUrl: string = 'http://localhost:4444/api/admin';
  constructor(private http: HttpClient) { }


  postFormData<T>(endpoint: string, formData: any): Observable<T> {

    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData, {
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  putFormData<T>(endpoint: string, formData: any): Observable<T> {

    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, formData, {
      headers: headers
    }).pipe(
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
}
