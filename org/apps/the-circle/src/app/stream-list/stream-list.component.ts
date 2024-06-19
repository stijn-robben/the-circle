import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
})
export class StreamListComponent implements OnInit {
    username = ''; // Initialize username with an empty string


  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername()!;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  startStreaming(): void {
    this.router.navigate(['/streamer', this.username]);
  }
}
