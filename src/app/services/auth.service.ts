import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    apiUrl: string = 'http://localhost:4444/api';
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
            this.http.post<any>(`${this.apiUrl}/user/login`, { username, password }).subscribe((res) => {
                this.setToken(res.token);
                this.router.navigate(['admin']);
            });
        } else {
            this.router.navigate(['login']);
            return throwError(new Error('Failed to login'));
        }
        return new Observable<any>(); // Add a return statement at the end of the function.
    }
}
