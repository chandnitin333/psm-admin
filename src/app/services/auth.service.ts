import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
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
        if (!username || !password) {
            console.log("Error: Username and password are required");
            this.router.navigate(['login']);
            return throwError(new Error('Username and password are required'));
        }

        return this.http.post<any>(`${API_URL}sign-in`, { user_id: username, password: password })
            .pipe(
                map((res: any) => {
                    if (res?.data?.token) {
                        this.setToken(res.data.token);

                        return res;
                    } else {
                        console.log("Error: Token not found");
                        this.router.navigate(['login']);
                        throw new Error('Token not found');
                    }
                }),
                catchError((error) => {
                    console.log("Error: ", error);
                    if (error.status === 400) {
                        console.log("Bad Request: ", error.error.message);
                    } else if (error.status === 401) {
                        console.log("Unauthorized: ", error.error.message);

                    } else {
                        console.log("An unexpected error occurred: ", error.error.message);
                    }

                    this.router.navigate(['login']);
                    return throwError(error);
                })
            );
    }

}
