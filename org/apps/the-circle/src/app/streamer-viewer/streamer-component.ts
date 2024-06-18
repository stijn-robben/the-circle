import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { ApiService } from '../services/api.service';
import { Message } from '../models/message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-streamer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './streamer-component.html',
})
export class StreamerComponent implements OnInit {
  public messages: Message[] = [];
  public user: string | null = null;
  public message = '';

  constructor(
    private signalRService: SignalrService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authService.getUsername();
    if (!this.user) {
      console.error('[StreamerComponent] No user is logged in.');
      return;
    }
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
        messages.forEach((msg) => {
          const parsedMsg = JSON.parse(msg);
          const newMessage = new Message(
            '',
            parsedMsg.user,
            parsedMsg.message,
            new Date().toISOString()
          );
          this.messages.push(newMessage);
        });
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
    if (this.message.trim() !== '') {
      if (this.user) {
        this.signalRService.sendMessage(this.user, this.message);
        this.message = '';
      } else {
        console.error('User is not logged in. Cannot send message.');
      }
    }
  }
}
