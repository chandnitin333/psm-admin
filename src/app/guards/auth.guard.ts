import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state): boolean => {
  const authService = inject(AuthService); // Inject the service here
  const router = new Router;
  if (!authService.isLoggedIn()) {
    router.navigate(['login']);
    return false;
  } else {
    return authService.isLoggedIn()
  }


};



