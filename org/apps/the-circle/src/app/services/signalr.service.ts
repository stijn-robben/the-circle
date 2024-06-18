import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeyService } from './key.service';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private socket!: WebSocket;
  private messages = new BehaviorSubject<string[]>([]);
  messages$ = this.messages.asObservable();
  private privateKey!: CryptoKey;
  private publicKey!: CryptoKey;

  constructor(private keyService: KeyService) {}

  async startConnection(username: string): Promise<void> {
    await this.keyService.initializePrivateKey();
    this.privateKey = await this.keyService.importPrivateKey(
      this.keyService['privateKeyPem']
    );
    await this.keyService.fetchAndVerifyPublicKey(username); // Fetch and verify public key here
    this.keyService.getPublicKey(username).subscribe(
      async (publicKey) => {
        this.publicKey = publicKey;
        console.log(`KeyService: Public key imported successfully.`);
        if (typeof window !== 'undefined' && 'WebSocket' in window) {
          this.socket = new WebSocket('ws://localhost:5000/chatHub');

          this.socket.onopen = () => {
            console.log('Connection started');
          };

          this.socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message from server:', data);

            const isValid = await this.keyService.verifySignature(
              data.message,
              data.signature,
              this.publicKey
            );

            console.log(
              `KeyService: Signature verification completed. Valid: ${isValid}`
            );

            if (isValid) {
              const displayMessage = `${data.user} says: ${data.message}`;
              this.messages.next([...this.messages.value, displayMessage]);
              console.log(
                'Message and signature verification completed. Valid: ' +
                  isValid
              );
            } else {
              console.warn('Invalid signature. Message will not be displayed.');
            }
          };

          this.socket.onerror = (error) => {
            console.error('WebSocket error: ' + error);
          };

          this.socket.onclose = () => {
            console.log('WebSocket connection closed');
          };
        } else {
          console.log('WebSocket is not available in this environment.');
        }
      },
      (error) => {
        console.error('Error fetching public key:', error);
      }
    );
  }

  async sendMessage(user: string, message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log(`KeyService: Signing message: ${message}`);
      const signature = await this.keyService.signMessage(message);
      console.log(`KeyService: Message signed successfully.`);

      console.log(`Sending message: ${message} by user: ${user}`);
      console.log('Signature generated: ' + signature);
      this.socket.send(
        JSON.stringify({
          user,
          message,
          signature,
        })
      );
    } else {
      console.error('Cannot send message. WebSocket is not open.');
    }
  }
}

// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class SignalrService {
//   private socket!: WebSocket;
//   private messages = new BehaviorSubject<string[]>([]);
//   messages$ = this.messages.asObservable();
//   privateKey!: CryptoKey;
//   publicKey!: CryptoKey;
//   exportedPublicKey!: string;

//   constructor() {}

//   async startConnection(): Promise<void> {
//     if (typeof window !== 'undefined' && 'WebSocket' in window) {
//       this.socket = new WebSocket('ws://localhost:5000/chatHub');

//       this.socket.onopen = () => {
//         console.log('Connection started');
//         this.generateKeys();
//       };

//       this.socket.onmessage = async (event) => {
//         const data = JSON.parse(event.data);
//         console.log('Received message from server:', data);

//         const publicKey = await this.importPublicKey(data.publicKey);
//         const isValid = await this.verifySignature(
//           data.message,
//           data.signature,
//           publicKey
//         );

//         const displayMessage = `${data.user} says: ${data.message} (signature valid: ${isValid})`;
//         this.messages.next([...this.messages.value, displayMessage]);
//         console.log(
//           'Message and signature verification completed. Valid: ' + isValid
//         );
//       };

//       this.socket.onerror = (error) => {
//         console.error('WebSocket error: ' + error);
//       };

//       this.socket.onclose = () => {
//         console.log('WebSocket connection closed');
//       };
//     } else {
//       console.log('WebSocket is not available in this environment.');
//     }
//   }

//   async generateKeys() {
//     if (typeof window !== 'undefined') {
//       const keyPair = await window.crypto.subtle.generateKey(
//         {
//           name: 'RSASSA-PKCS1-v1_5',
//           modulusLength: 2048,
//           publicExponent: new Uint8Array([1, 0, 1]),
//           hash: { name: 'SHA-256' },
//         },
//         true,
//         ['sign', 'verify']
//       );
//       this.privateKey = keyPair.privateKey;
//       this.publicKey = keyPair.publicKey;
//       console.log('Keys generated successfully.');
//       const exportedKey = await window.crypto.subtle.exportKey(
//         'spki',
//         this.publicKey
//       );
//       this.exportedPublicKey = window.btoa(
//         String.fromCharCode(...new Uint8Array(exportedKey))
//       );
//       console.log('Public key exported and encoded: ' + this.exportedPublicKey);
//     } else {
//       console.log('window object is not available.');
//     }
//   }

//   async sendMessage(user: string, message: string) {
//     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//       const signature = await this.signMessage(message);
//       console.log(`Sending message: ${message} by user: ${user}`);
//       console.log('Signature generated: ' + signature);
//       this.socket.send(
//         JSON.stringify({
//           user,
//           message,
//           signature,
//           publicKey: this.exportedPublicKey,
//         })
//       );
//     } else {
//       console.error('Cannot send message. WebSocket is not open.');
//     }
//   }

//   async signMessage(message: string) {
//     if (typeof window !== 'undefined') {
//       const encoder = new TextEncoder();
//       const data = encoder.encode(message);
//       const signature = await window.crypto.subtle.sign(
//         'RSASSA-PKCS1-v1_5',
//         this.privateKey,
//         data
//       );
//       return window.btoa(String.fromCharCode(...new Uint8Array(signature)));
//     } else {
//       throw new Error('window object is not available.');
//     }
//   }

//   async importPublicKey(publicKeyString: string) {
//     if (typeof window !== 'undefined') {
//       const binaryDer = window.atob(publicKeyString);
//       const array = Uint8Array.from(binaryDer, (c) => c.charCodeAt(0));
//       return window.crypto.subtle.importKey(
//         'spki',
//         array,
//         { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
//         true,
//         ['verify']
//       );
//     } else {
//       throw new Error('window object is not available.');
//     }
//   }

//   async verifySignature(
//     message: string,
//     signature: string,
//     publicKey: CryptoKey
//   ) {
//     if (typeof window !== 'undefined') {
//       const encoder = new TextEncoder();
//       const data = encoder.encode(message);
//       const sigBuffer = Uint8Array.from(window.atob(signature), (c) =>
//         c.charCodeAt(0)
//       );
//       return window.crypto.subtle.verify(
//         'RSASSA-PKCS1-v1_5',
//         publicKey,
//         sigBuffer,
//         data
//       );
//     } else {
//       throw new Error('window object is not available.');
//     }
//   }
// }
