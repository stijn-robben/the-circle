import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeyService } from './key.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private socket!: WebSocket;
  private messages = new BehaviorSubject<string[]>([]);
  messages$ = this.messages.asObservable();
  private privateKey!: CryptoKey;

  constructor(private keyService: KeyService, private apiService: ApiService) {}

  async startConnection(streamername: string): Promise<void> {
    try {
      await this.keyService.initializePrivateKey();
      this.privateKey = await this.keyService.importPrivateKey(
        this.keyService['privateKeyPem']
      );

      if (typeof window !== 'undefined' && 'WebSocket' in window) {
        this.socket = new WebSocket('ws://145.49.14.169:5000/chatHub');

        this.socket.onopen = () => {
          console.log('Connection started');
        };

        this.socket.onmessage = async (event) => {
          //onmessage event being called
          const data = JSON.parse(event.data);
          console.log('Received message from server:', data);

          this.keyService.getPublicKey(data.user).subscribe(
            async (publicKey) => {
              console.log(
                `Fetched public key for user ${data.user}:`,
                publicKey
              );

              const isValid = await this.keyService.verifySignature(
                data.message,
                data.signature,
                publicKey
              );

              console.log(
                `Signature verification completed for user ${data.user}. Valid: ${isValid}`
              );

              if (isValid) {
                const displayMessage = JSON.stringify({
                  user: data.user,
                  message: data.message,
                });
                this.messages.next([...this.messages.value, displayMessage]);
                console.log(
                  'Message and signature verification completed. Valid:',
                  isValid
                );

                this.apiService
                  .sendMessage(streamername, {
                    username: data.user,
                    text: data.message,
                  })
                  .subscribe(
                    (response) => {
                      console.log('Message saved to database:', response);
                    },
                    (error) => {
                      console.error('Error saving message to database:', error);
                    }
                  );
              } else {
                console.warn(
                  'Invalid signature. Message will not be displayed.'
                );
              }
            },
            (error) => {
              console.error('Error fetching public key for user:', error);
            }
          );
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
      try {
        console.log(`Signing message: ${message}`);
        const signature = await this.keyService.signMessage(message);
        console.log('Message signed successfully. Signature:', signature);
  
        // Generate a unique ID for the message
        const messageId = Date.now().toString();
  
        console.log(`Sending message: ${message} by user: ${user}`);
        this.socket.send(
          JSON.stringify({
            id: messageId,
            user,
            message,
            signature,
          })
        );
      } catch (error) {
        console.error('Error signing or sending message:', error);
      }
    } else {
      console.error('Cannot send message. WebSocket is not open.');
    }
  }
}
