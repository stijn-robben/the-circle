// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyService } from './key.service';
import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private keyService: KeyService) {}

  async loginUser(username: string): Promise<boolean> {
    try {
      return new Promise((resolve, reject) => {
        this.keyService.getPublicKey(username).subscribe(
          async (publicKey) => {
            this.keyService.publicKey = publicKey;

            const signedUsername = await this.keyService.signMessage(username);

            const isValid = await this.keyService.verifySignature(
              username,
              signedUsername,
              publicKey
            );

            if (isValid) {
              localStorage.setItem('username', username);
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (error) => {
            console.error('Error fetching public key:', error);
            resolve(false);
          }
        );
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  }
  getUsernameFromStorage(): string | null {
    return localStorage.getItem('username');
  }

  logoutUser(): void {
    localStorage.removeItem('username');
  }
}
