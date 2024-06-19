import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { KeyService } from './key.service';
import { ApiService } from './api.service';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private socket!: WebSocket;
  private messages = new BehaviorSubject<string[]>([]);
  messages$ = this.messages.asObservable();
  private privateKey!: CryptoKey;
  private streamername: string | null = null;
  private username: string | null = null;

  constructor(
    private keyService: KeyService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}
  setStreamerName(streamername: string): void {
    this.streamername = streamername;
  }
  setUsername(username: string): void {
    this.username = username;
  }
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
          if (this.streamername) {
            this.fetchHistory(this.streamername);
          }
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
            console.log('[SignalrService] streamerName: ', this.streamername);
            if (this.streamername !== this.username) {
              const messageData = {
                username: parsedMessage.user,
                text: parsedMessage.message,
                time: new Date().toISOString(),
              };
              this.apiService
                .sendMessage(this.streamername!, messageData)
                .subscribe(
                  () => {
                    console.log('Message sent to API successfully.');
                  },
                  (error) => {
                    console.error('Error sending message to API:', error);
                  }
                );
            } else {
              console.error('Streamer name is not set.');
            }
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
  private fetchHistory(streamername: string): void {
    this.apiService.getMessages(streamername).subscribe(
      (messages) => {
        console.log('Fetched history messages:', messages);
        const historyMessages = messages.map((message) =>
          JSON.stringify({
            id: message._id,
            user: message.username,
            message: message.text,
            timestamp: message.dateTime,
          })
        );
        this.messages.next([...this.messages.value, ...historyMessages]);
        console.log(
          'History messages added to BehaviorSubject:',
          this.messages.value
        );
      },
      (error) => {
        console.error('Error fetching history messages:', error);
      }
    );
  }
}
