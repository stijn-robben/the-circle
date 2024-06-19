import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { Subscription, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viewer-component.html',
})
export class ViewerComponent implements OnInit, OnDestroy {
  public messages: { id: string; user: string; message: string }[] = [];
  private subscription: Subscription | undefined;
  public user: string | null = ''; // Hardcoded viewer for testing
  public message = '';
  public streamername: string | null = null;

  constructor(
    private signalRService: SignalrService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.user = this.authService.getUsername();
    if (this.user) {
      this.signalRService.setUsername(this.user); // Set username in service
    }
    this.subscription = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const streamername = params.get('username')!;
          this.streamername = streamername;
          this.signalRService.setStreamerName(streamername); // Set streamer name in service
          return Promise.resolve();
        })
      )
      .subscribe();
    this.subscription.add(
      this.signalRService.messages$.subscribe((messages: string[]) => {
        messages.forEach((msg) => {
          const parsedMsg = JSON.parse(msg);
          const newMessage = {
            id: parsedMsg.id,
            user: parsedMsg.user,
            message: parsedMsg.message,
          };
          if (!this.messages.some((m) => m.id === newMessage.id)) {
            this.messages.push(newMessage);
          }
        });
        this.scrollToBottom();
      })
    );

    this.signalRService.startConnection();
  }

  sendMessage(): void {
    if (this.message.trim() !== '') {
      if (this.user) {
        this.signalRService.sendMessage(this.user, this.message);
        this.message = '';
        this.scrollToBottom();
      } else {
        console.error('User is not set. Cannot send message.');
      }
    }
  }

  scrollToBottom() {
    const chatBox = document.getElementById('chatMessages');
    if (chatBox) {
      setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 100); // Delay to ensure the DOM is updated
    } else {
      console.warn('Chat box element not found.');
    }
  }
}
