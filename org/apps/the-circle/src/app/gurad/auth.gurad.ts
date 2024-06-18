import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      console.log('[AuthGuard] User is logged in, allowing access to route.');
      return true;
    } else {
      console.warn(
        '[AuthGuard] User is not logged in, redirecting to login page.'
      );
      this.router.navigate(['/login']);
      return false;
    }
  }
}
