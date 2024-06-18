import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { ApiService } from '../services/api.service';
import { Message } from '../models/message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-streamer',
  standalone: true,
  imports: [CommonModule, FormsModule], // Voeg FormsModule toe
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
          console.log('StreamerComponent: messages', messages);
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
  logMessage(msg: Message): boolean {
    console.log('Message in template:', msg);
    return true;
  }

  sendMessage(): void {
    this.signalRService.sendMessage(this.user, this.message);
    this.message = '';
  }
}
