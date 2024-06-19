import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { KeyService } from './key.service';
import { ApiService } from './api.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private socket!: WebSocket;
  private messages = new BehaviorSubject<string[]>([]);
  messages$ = this.messages.asObservable();
  private privateKey!: CryptoKey;

  constructor(private keyService: KeyService, private apiService: ApiService) {}

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
          const parsedMessage = JSON.parse(message);
          console.log('Received message from server:', parsedMessage);

          const publicKey = await firstValueFrom(
            this.keyService.getPublicKey(parsedMessage.user)
          );
          const isValid = await this.keyService.verifySignature(
            parsedMessage.message,
            parsedMessage.signature,
            publicKey
          );

          if (isValid) {
            this.messages.next([...this.messages.value, message]);
          } else {
            console.error('Invalid message signature');
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
      const id = uuidv4(); // Generate a unique ID for the message
      const signature = await this.keyService.signMessage(message);
      const formattedMessage = JSON.stringify({ id, user, message, signature });
      this.socket.send(formattedMessage);
      // Emit the message locally for the sender
      this.messages.next([...this.messages.value, formattedMessage]);
    } else {
      console.error('Cannot send message. WebSocket is not open.');
    }
  }
}
