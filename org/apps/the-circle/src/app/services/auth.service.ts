import { Injectable } from '@angular/core';
import { KeyService } from '../services/key.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = false;

  constructor(private keyService: KeyService) {}

  async login(username: string): Promise<boolean> {
    try {
      console.log(
        '[AuthService] Step 2: Encrypting hashed username with private key'
      );
      const encryptedMessage = await this.keyService.signMessage(username);
      console.log(`[AuthService] Encrypted message: ${encryptedMessage}`);

      // Fetch and verify public key
      console.log(
        `[AuthService] Step 3: Fetching and verifying public key for username: ${username}`
      );
      await this.keyService.fetchAndVerifyPublicKey(username);

      // Ensure publicKey is set before proceeding
      if (!this.keyService.publicKey) {
        console.error('[AuthService] Public key is not available.');
        throw new Error('Public key not available');
      }

      // Decrypt and verify received username
      console.log(
        '[AuthService] Step 4: Decrypting and verifying received username'
      );
      const isValid = await this.keyService.verifySignature(
        username,
        encryptedMessage,
        this.keyService.publicKey
      );

      if (isValid) {
        console.log('[AuthService] Login successful!');
        this.loggedIn = true;
        localStorage.setItem('currentUsername', username); // Save username to localStorage
        return true;
      } else {
        console.error('[AuthService] Error: Hashed usernames do not match.');
        return false;
      }
    } catch (error) {
      console.error('[AuthService] Error during login:', error);
      return false;
    }
  }

  isLoggedIn(): boolean {
    const loggedInStatus =
      this.loggedIn || !!localStorage.getItem('currentUsername');
    console.log(`Check isLoggedIn: ${loggedInStatus}`);
    return loggedInStatus;
  }

  logout(): void {
    console.log('Logging out user');
    this.loggedIn = false;
    localStorage.removeItem('currentUsername');
    console.log('User logged out, currentUsername removed from localStorage');
  }

  getUsername(): string | null {
    const username = localStorage.getItem('currentUsername');
    console.log(`Get currentUsername from localStorage: ${username}`);
    return username;
  }
  getPublicKey(username: string) {
    const streamername = this.keyService.getPublicKey(username);
    return streamername;
  }
}
