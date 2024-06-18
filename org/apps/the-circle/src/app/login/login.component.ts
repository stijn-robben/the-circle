import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = '';
  loginError: string | null = null;
  isLoggedIn: boolean = false; // Define the property if it's supposed to exist

  constructor(private authService: AuthService) {}

  async login() {
    this.loginError = null;
    try {
      const isLoggedIn = await this.authService.login(this.username);
      this.isLoggedIn = isLoggedIn; // Set the property based on login result
      if (!isLoggedIn) {
        this.loginError = 'Login failed. Please check your username.';
      }
    } catch (error) {
      console.error('Error during login:', error);
      this.loginError = 'An error occurred during login. Please try again.';
    }
  }
}
