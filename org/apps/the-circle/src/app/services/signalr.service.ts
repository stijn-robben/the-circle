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
  private publicKey!: CryptoKey;

  constructor(private keyService: KeyService, private apiService: ApiService) {}

  async startConnection(streamername: string): Promise<void> {
    await this.keyService.initializePrivateKey();
    this.privateKey = await this.keyService.importPrivateKey(
      this.keyService['privateKeyPem']
    );
    await this.keyService.fetchAndVerifyPublicKey(streamername);
    // this.keyService.getPublicKey(streamername).subscribe(
    //   async (publicKey) => {
    //     this.publicKey = publicKey;
        console.log(`KeyService: Public key imported successfully.`);
        if (typeof window !== 'undefined' && 'WebSocket' in window) {
          this.socket = new WebSocket('ws://145.49.14.169:5000/chatHub');

          this.socket.onopen = () => {
            console.log('Connection started');
          };

          this.socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message from server:', data);
            this.keyService.getPublicKey(data.username).subscribe(
              async (publicKey) => {
                this.publicKey = publicKey;
            const isValid = await this.keyService.verifySignature(
              data.message,
              data.signature,
              this.publicKey
            );

            console.log(
              `KeyService: Signature verification completed. Valid: ${isValid}`
            );

            if (isValid) {
              const displayMessage = JSON.stringify({
                user: data.user,
                message: data.message,
              });
              this.messages.next([...this.messages.value, displayMessage]);
              console.log(
                'Message and signature verification completed. Valid: ' +
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
