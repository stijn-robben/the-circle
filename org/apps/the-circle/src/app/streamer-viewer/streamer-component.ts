import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './streamer-component.html',
})
export class ViewerComponent implements OnInit, OnDestroy {
  public messages: string[] = [];
  private subscription: Subscription | undefined;
  public user: string | null = ''; // Hardcoded viewer for testing
  public message = '';

  constructor(
    private signalRService: SignalrService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.user = this.authService.getUsername();
    console.log('ViewerComponent: userLokalstorage:', this.user);
    this.subscription = this.signalRService.messages$.subscribe(
      (messages: string[]) => {
        this.messages = messages;
        this.scrollToBottom();
      }
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

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { SignalrService } from '../services/signalr.service';
// import { Message } from '../models/message.model';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../services/auth.service';
// import { Subscription, switchMap } from 'rxjs';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-streamer',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './streamer-component.html',
// })
// export class StreamerComponent implements OnInit, OnDestroy {
//   public messages: Message[] = [];
//   public user: string | null = null;
//   subscription: Subscription | undefined = undefined;
//   public streamername: string | null = null;
//   public message = '';

//   constructor(
//     private signalRService: SignalrService,
//     private authService: AuthService,
//     private route: ActivatedRoute
//   ) {}

//   async ngOnInit(): Promise<void> {
//     this.subscription = this.route.paramMap
//       .pipe(
//         switchMap((params) => {
//           const streamername = params.get('username')!;
//           this.streamername = streamername;
//           return Promise.resolve();
//         })
//       )
//       .subscribe();
//     this.user = this.authService.getUsername();
//     if (!this.user) {
//       console.error('[StreamerComponent] No user is logged in.');
//       return;
//     }

//     this.signalRService.messages$.subscribe((messages: string[]) => {
//       messages.forEach((msg) => {
//         const parsedMsg = JSON.parse(msg);
//         const newMessage = new Message(
//           parsedMsg.id,
//           parsedMsg.user,
//           parsedMsg.message,
//           new Date(parsedMsg.timestamp).toISOString()
//         );

//         if (!this.messages.some((m) => m._id === newMessage._id)) {
//           this.messages.push(newMessage);
//         }
//       });
//     });

//     await this.signalRService.startConnection();
//   }

//   ngOnDestroy(): void {
//     if (this.subscription) {
//       this.subscription.unsubscribe();
//     }
//   }

//   logMessage(msg: Message): boolean {
//     console.log('Message in template:', msg);
//     return true;
//   }

//   sendMessage(): void {
//     if (this.message.trim() !== '') {
//       if (this.user) {
//         this.signalRService.sendMessage(this.user, this.message);
//         this.message = '';
//         this.scrollToBottom();
//       } else {
//         console.error('User is not logged in. Cannot send message.');
//       }
//     }
//   }

//   scrollToBottom() {
//     const chatBox = document.getElementById('chatMessages');
//     if (chatBox) {
//       setTimeout(() => {
//         chatBox.scrollTop = chatBox.scrollHeight;
//       }, 100); // Delay to ensure the DOM is updated
//     }
//   }
// }
