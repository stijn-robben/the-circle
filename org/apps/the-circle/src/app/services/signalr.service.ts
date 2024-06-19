import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { KeyService } from './key.service';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private socket!: WebSocket;
  private messages = new BehaviorSubject<string[]>([]);
  messages$ = this.messages.asObservable();
  private privateKey!: CryptoKey;

  constructor(private keyService: KeyService) {}

  async startConnection(): Promise<void> {
    try {
      await this.keyService.initializePrivateKey();
      this.privateKey = await this.keyService.importPrivateKey(
        this.keyService['privateKeyPem']
      );

      if (typeof window !== 'undefined' && 'WebSocket' in window) {
        this.socket = new WebSocket('ws://localhost:5000');

        this.socket.onopen = () => {
          console.log('WebSocket connection started');
        };

        this.socket.onmessage = async (event) => {
          const blob = event.data;
          const message = await blob.text();
          console.log('Received message from server:', message);
          const publicKey = await firstValueFrom(
            this.keyService.getPublicKey(JSON.parse(message).user)
          );
          const isValid = await this.keyService.verifySignature(
            JSON.parse(message).message,
            JSON.parse(message).signature,
            publicKey
          );

          if (isValid) {
            this.messages.next([...this.messages.value, message]);
          } else {
            console.warn('Invalid message signature, message discarded');
          }
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
        };
      } else {
        console.log('WebSocket is not available in this environment.');
      }
    } catch (error) {
      console.error('Error initializing connection:', error);
    }
  }

  async sendMessage(user: string, message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const signature = await this.keyService.signMessage(message);
      const formattedMessage = JSON.stringify({
        user,
        message,
        signature,
      });
      this.socket.send(formattedMessage);
    } else {
      console.error('Cannot send message. WebSocket is not open.');
    }
  }
}

// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { KeyService } from './key.service';
// import { ApiService } from './api.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class SignalrService {
//   private socket!: WebSocket;
//   private messages = new BehaviorSubject<string[]>([]);
//   messages$ = this.messages.asObservable();
//   private privateKey!: CryptoKey;

//   constructor(private keyService: KeyService, private apiService: ApiService) {}

//   async startConnection(): Promise<void> {
//     try {
//       await this.keyService.initializePrivateKey();
//       this.privateKey = await this.keyService.importPrivateKey(
//         this.keyService['privateKeyPem']
//       );

//       if (typeof window !== 'undefined' && 'WebSocket' in window) {
//         this.socket = new WebSocket('ws://localhost:5000');

//         this.socket.onopen = () => {
//           console.log('WebSocket connection started');
//         };

//         this.socket.onmessage = async (event) => {
//           const blob = event.data;
//           const message = await blob.text();
//           console.log('Received message from server:', message);
//           this.messages.next([...this.messages.value, message]);
//         };

//         this.socket.onerror = (error) => {
//           console.error('WebSocket error:', error);
//         };

//         this.socket.onclose = () => {
//           console.log('WebSocket connection closed');
//         };
//       } else {
//         console.log('WebSocket is not available in this environment.');
//       }
//     } catch (error) {
//       console.error('Error initializing connection:', error);
//     }
//   }

//   sendMessage(user: string, message: string) {
//     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//       const formattedMessage = `${user}: ${message}`;
//       this.socket.send(formattedMessage);
//     } else {
//       console.error('Cannot send message. WebSocket is not open.');
//     }
//   }
// }

// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { KeyService } from './key.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class SignalrService {
//   private socket!: WebSocket;
//   private messages = new BehaviorSubject<string[]>([]);
//   messages$ = this.messages.asObservable();
//   private privateKey!: CryptoKey;
//   private receivedMessages = new Set<string>(); // Set om ontvangen berichten bij te houden

//   constructor(private keyService: KeyService) {}

//   async startConnection(streamername: string): Promise<void> {
//     try {
//       await this.keyService.initializePrivateKey();
//       this.privateKey = await this.keyService.importPrivateKey(
//         this.keyService['privateKeyPem']
//       );

//       if (typeof window !== 'undefined' && 'WebSocket' in window) {
//         this.socket = new WebSocket('ws://192.168.1.123:5000/chatHub');

//         this.socket.onopen = () => {
//           console.log('Connection started');
//         };

//         this.socket.onmessage = async (event) => {
//           const data = JSON.parse(event.data);
//           console.log('Received message from server:', data);

//           this.keyService.getPublicKey(data.user).subscribe(
//             async (publicKey) => {
//               console.log(
//                 `Fetched public key for user ${data.user}:`,
//                 publicKey
//               );

//               const isValid = await this.keyService.verifySignature(
//                 data.message,
//                 data.signature,
//                 publicKey
//               );

//               console.log(
//                 `Signature verification completed for user ${data.user}. Valid: ${isValid}`
//               );

//               if (isValid) {
//                 const uniqueId = this.generateUniqueId(
//                   data.user,
//                   data.message,
//                   data.timestamp
//                 );
//                 const displayMessage = JSON.stringify({
//                   id: uniqueId,
//                   user: data.user,
//                   message: data.message,
//                   timestamp: data.timestamp,
//                 });

//                 if (!this.receivedMessages.has(uniqueId)) {
//                   this.receivedMessages.add(uniqueId);
//                   this.messages.next([...this.messages.value, displayMessage]);
//                   console.log(
//                     'Message and signature verification completed. Valid:',
//                     isValid
//                   );
//                 } else {
//                   console.warn(
//                     'Duplicate message detected. Not adding to messages.'
//                   );
//                 }
//               } else {
//                 console.warn(
//                   'Invalid signature. Message will not be displayed.'
//                 );
//               }
//             },
//             (error) => {
//               console.error('Error fetching public key for user:', error);
//             }
//           );
//         };

//         this.socket.onerror = (error) => {
//           console.error('WebSocket error:', error);
//         };

//         this.socket.onclose = () => {
//           console.log('WebSocket connection closed');
//         };
//       } else {
//         console.log('WebSocket is not available in this environment.');
//       }
//     } catch (error) {
//       console.error('Error initializing connection:', error);
//     }
//   }

//   async sendMessage(user: string, message: string) {
//     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//       try {
//         console.log(`Signing message: ${message}`);
//         const signature = await this.keyService.signMessage(message);
//         console.log('Message signed successfully. Signature:', signature);

//         console.log(`Sending message: ${message} by user: ${user}`);
//         const timestamp = new Date().toISOString();
//         const uniqueId = this.generateUniqueId(user, message, timestamp);

//         this.socket.send(
//           JSON.stringify({
//             id: uniqueId,
//             user,
//             message,
//             signature,
//           })
//         );
//       } catch (error) {
//         console.error('Error signing or sending message:', error);
//       }
//     } else {
//       console.error('Cannot send message. WebSocket is not open.');
//     }
//   }

//   private generateUniqueId(
//     user: string,
//     message: string,
//     timestamp: string
//   ): string {
//     return `${user}-${message}-${timestamp}`;
//   }
// }
