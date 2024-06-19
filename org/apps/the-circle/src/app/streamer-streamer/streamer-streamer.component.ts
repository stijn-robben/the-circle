import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-stream-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './streamer-streamer.component.html',
})
export class StreamStreamerComponent implements OnInit, OnDestroy {
  public messages: string[] = [];
  private subscription: Subscription | undefined;
  public user: string | null = ''; // Hardcoded user for testing
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
    console.log('StreamStreamerComponent: userLokalstorage:', this.user);
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
// import { Message } from '../models/message.model';
// import { SignalrService } from '../services/signalr.service';
// import { ApiService } from '../services/api.service';
// import { AuthService } from '../services/auth.service';
// import { Subscription, switchMap } from 'rxjs';
// import { ActivatedRoute } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-stream-list',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './streamer-streamer.component.html',
// })
// export class StreamStreamerComponent implements OnInit, OnDestroy {
//   public messages: Message[] = [];
//   subscription: Subscription | undefined = undefined;
//   public user: string | null = null;
//   public message = '';

//   constructor(
//     private signalRService: SignalrService,
//     private apiService: ApiService,
//     private authService: AuthService,
//     private route: ActivatedRoute
//   ) {}

//   ngOnDestroy(): void {
//     if (this.subscription) {
//       this.subscription.unsubscribe();
//     }
//   }

//   async ngOnInit(): Promise<void> {
//     this.subscription = this.route.paramMap
//       .pipe(
//         switchMap((params) => {
//           const streamername = params.get('username')!;
//           this.user = streamername;
//           return Promise.resolve();
//         })
//       )
//       .subscribe();
//     if (!this.user) {
//       console.error('[StreamerComponent] No user is logged in.');
//       return;
//     }
//     try {
//       this.apiService.getMessages(this.user).subscribe(
//         (messages: Message[]) => {
//           console.log('StreamerComponent: messages', messages);
//           this.messages = messages;
//         },
//         (error) => {
//           console.error('Error fetching messages:', error);
//         }
//       );

//       this.signalRService.messages$.subscribe((messages: string[]) => {
//         messages.forEach((msg) => {
//           const parsedMsg = JSON.parse(msg);
//           const newMessage = new Message(
//             parsedMsg.id,
//             parsedMsg.user,
//             parsedMsg.message,
//             new Date(parsedMsg.datetime).toISOString()
//           );

//           if (!this.messages.some((m) => m._id === newMessage._id)) {
//             this.messages.push(newMessage);
//           }
//         });
//       });

//       await this.signalRService.startConnection(this.user);
//     } catch (error) {
//       console.error('Error initializing chat component:', error);
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
