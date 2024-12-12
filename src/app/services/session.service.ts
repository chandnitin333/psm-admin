import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor() {
    // Clear session on browser close
    window.addEventListener('beforeunload', () => {
        sessionStorage.clear();
    });
  }
}
