import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { API_URL } from '../modules/admin/constants/admin.constant';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private router: Router, private http: HttpClient) { }

    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn() {
        return this.getToken() !== null;
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['login']);
    }

    login({ username, password }: any): Observable<any> {
        if (username !== '' && password !== '') {
            console.log('login===', +`${API_URL}sign-in`);
            this.http.post<any>(`${API_URL}sign-in`, { user_id: username, password: password }).subscribe((res) => {

                if (!res?.data?.token) {
                    this.router.navigate(['login']);
                }
                this.setToken(res?.data?.token);
                this.router.navigate(['admin']);
            });
        } else {
            this.router.navigate(['login']);
            return throwError(new Error('Failed to login'));
        }
        return new Observable<any>(); // Add a return statement at the end of the function.
    }
}
