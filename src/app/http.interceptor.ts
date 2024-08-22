import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Set common headers
    const modifiedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzI0MzUxMDM4LCJleHAiOjE3MzQ3MTkwMzh9.14PSTkzLmVAm5dUyQ8dxj8aQG-IHc5IfyuGYWLwrYyk' // Replace with your actual token or logic to get the token
      }
    });

    // Handle errors
    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Server-side error: Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}