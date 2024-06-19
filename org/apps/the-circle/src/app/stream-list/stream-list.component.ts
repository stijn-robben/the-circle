import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stream-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: ',/stream-list.component.html',
})
export class StreamListComponent implements OnInit {
    username = ''; // Initialize username with an empty string
    usernames: Observable<string[]> = new Observable<string[]>();
  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername()!;
    this.usernames = this.apiService.getAllPersons();
    this.usernames.subscribe(usernames => {
        console.log('usernames fetched: ', usernames);
      });
      }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  startStreaming(): void {
    this.router.navigate(['/streamer', this.username]);
  }



}
