// // auth.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { KeyService } from './key.service';
// import { Observable } from 'rxjs';
// import { switchMap, catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   constructor(private http: HttpClient, private keyService: KeyService) {}

//   async loginUser(username: string): Promise<boolean> {
//     try {
//       return new Promise((resolve, reject) => {
//         this.keyService.getPublicKey(username).subscribe(
//           async (publicKey) => {
//             this.keyService.publicKey = publicKey;

//             const signedUsername = await this.keyService.signMessage(username);

//             const isValid = await this.keyService.verifySignature(
//               username,
//               signedUsername,
//               publicKey
//             );

//             if (isValid) {
//               localStorage.setItem('username', username);
//               resolve(true);
//             } else {
//               resolve(false);
//             }
//           },
//           (error) => {
//             console.error('Error fetching public key:', error);
//             resolve(false);
//           }
//         );
//       });
//     } catch (error) {
//       console.error('Error logging in:', error);
//       return false;
//     }
//   }
//   getUsernameFromStorage(): string | null {
//     return localStorage.getItem('username');
//   }

//   logoutUser(): void {
//     localStorage.removeItem('username');
//   }
// }

// ^ code Ammar ^
// v werkende code v

import { Injectable } from '@angular/core';
import { KeyService } from '../services/key.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private keyService: KeyService) {}

  async login(username: string): Promise<boolean> {
    try {
      console.log('Step 2: Encrypting hashed username with private key');
      const encryptedMessage = await this.keyService.signMessage(username);
      console.log(`Encrypted message: ${encryptedMessage}`);

      // Fetch and verify public key
      console.log('Step 3: Fetching and verifying public key', username);
      await this.keyService.fetchAndVerifyPublicKey(username);

      // Ensure publicKey is set before proceeding
      if (!this.keyService.publicKey) {
        console.log('AAAAAAAAA', this.keyService.publicKey);
        throw new Error('Public key not available');
      }

      // Decrypt and verify received username
      console.log('Step 4: Decrypting and verifying received username');
      const isValid = await this.keyService.verifySignature(
        username,
        encryptedMessage,
        this.keyService.publicKey
      );

      if (isValid) {
        console.log('Login successful!');
        return true;
      } else {
        console.log('Error: Hashed usernames do not match.');
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }
}
