import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.loginError = null;
    try {
      console.log(
        `[LoginComponent] Attempting to log in with username: ${this.username}`
      );
      const isLoggedIn = await this.authService.login(this.username);
      if (isLoggedIn) {
        console.log(
          '[LoginComponent] Login successful, navigating to /stream-list'
        );
        this.router.navigate(['/stream-list']);
      } else {
        console.error(
          '[LoginComponent] Login failed. Please check your username.'
        );
        this.loginError = 'Login failed. Please check your username.';
      }
    } catch (error) {
      console.error('[LoginComponent] Error during login:', error);
      this.loginError = 'An error occurred during login. Please try again.';
    }
  }
}
