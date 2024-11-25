import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private logoutTimer: any;
  private readonly timeoutDuration = 30 * 60 * 1000; // 30 minutes

  constructor(private router: Router, private ngZone: NgZone, private auth:AuthService) {}

  startMonitoring(): void {
    this.resetTimer();

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => 
      window.addEventListener(event, this.resetTimer.bind(this))
    );
  }

  private resetTimer(): void {
    clearTimeout(this.logoutTimer);

    this.ngZone.runOutsideAngular(() => {
      this.logoutTimer = setTimeout(() => {
        this.ngZone.run(() => this.logout());
      }, this.timeoutDuration);
    });
  }

  private logout(): void {
    // Clear session, logout logic
    localStorage.clear();
    this.auth.logout();
    console.log('User logged out due to inactivity');
  }
}
