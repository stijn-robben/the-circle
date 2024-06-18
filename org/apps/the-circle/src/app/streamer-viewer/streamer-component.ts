import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { ApiService } from '../services/api.service';
import { Message } from '../models/message';

@Component({
  selector: 'app-streamer',
  templateUrl: './streamer-component.html',
})
export class StreamerComponent implements OnInit {
  public messages: Message[] = [];
  public user = 'Ammar';
  public message = '';

  constructor(
    private signalRService: SignalrService,
    private apiService: ApiService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.apiService.getMessages(this.user).subscribe(
        (messages: Message[]) => {
          this.messages = messages;
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
      this.signalRService.messages$.subscribe((messages: string[]) => {
        this.messages = messages.map((msg) => JSON.parse(msg));
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
