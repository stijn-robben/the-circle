import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-streamer',
  templateUrl: './streamer-component.html',
})

export class StreamerComponent implements OnInit {
  public messages: string[] = [];
  public user = 'Ammar';
  public message = '';

  constructor(private signalRService: SignalrService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.signalRService.messages$.subscribe((messages) => {
        this.messages = messages;
      });
      await this.signalRService.startConnection(this.user);
    } catch (error) {
      console.error('Error initializing chat component:', error);
    }
  }

  sendMessage(): void {
    this.signalRService.sendMessage(this.user, this.message);
    this.message = '';
  }
}
