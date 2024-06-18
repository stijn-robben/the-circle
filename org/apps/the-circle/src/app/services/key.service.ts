// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, from } from 'rxjs';
// import { switchMap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class KeyService {
//   private privateKey!: CryptoKey;
//   public publicKey!: CryptoKey;
//   private privateKeyPem: string = `-----BEGIN PRIVATE KEY-----
// MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDC3Qy7F/gKKEq+
// 6K7+fKdnettxlWzgB9R/RAuPu0awcswEmDRh0y53gQBXGntBogM46JFmmEjRr5QJ
// X4K4NlkurLUA5DzuJ0gXcL2CDNtzBgfyLEbhooNJBuwpvcGMbE2rDELN8lhgWpdl
// G9fqVrYVJTPMFwUoY9GaSZwf066uEstTRw9LTS6B3KPTw2MopMka2IGzbxbij6ro
// c1PiMCkTGU0+uiMWFoWQtcHbBep5uKekITO1IuLZYN18tv6i3H/QH/LXw/oE22hg
// +4V2DKBGEgYkIPt7cXc7/iwBs2a954C9vbynzED7oW2rvmG1NHdkVYZWccMQswFt
// zso1CVvJAgMBAAECggEAHjZJkARyV5jRpfHLl/dZuSiKN30UaVOtdaHmLP27QwY5
// bYjvri8g6DRfCiI39AAbgcpFKOP5flE7oYxmZws+Hod2dNHuRHpgqgm3yB8YMyg/
// OSP2RWt98WeaXApopM3x6NA411d4rk+9Y1bCzjltd6/R7RWwngeD6uj4xNJ8Jc7M
// 2NpCTQ8wXmF6ngNZ1gB0nR6GJStpdGMHvSeoumdzk7XArZD5kPEQgrCTqppvyqvC
// 2DwS1cdnhfcxWc0+P2YHFUG2+4enIYSsN4FGlESSfWg76gZevaejW1gNhcGQwk5n
// BZ4q87D1tCZBkEn2GQmfaR20AtC4ptE/f2WP++jyVQKBgQDokKm4/gRJN9ikICjW
// jdfkPw7tQ86IhujFQOmCo0pHVGFGdzR98iDx1TZNIH5DyGDPP6o0L75vJqtDaeQO
// udgiYImc3SDiQMz0zctvJVfR+I9Ep7F6/tebsUvmr83Io8rwUwjD4UEnuVwSUgYp
// JZPUwxpRsuuFEso6ycNyaPS9nwKBgQDWf9JXmp5+zyv1CC6YXJAcEfOsRxNM+9NW
// N93rS4qAl2hGyk1bhk1eOcuItAbyxuu5JsqEBaAuIInumczqGW8Gm+JQ6KhRDbRc
// 8iiAZSKVdvzW8fXLNmzVv14TFk9e3gtMNxQxMHZ0W+UFUrpAf07+hS/j4LP7vgTV
// o/EoCr2dlwKBgQDlz7X3eQPROl9Y5/KS+b2B7ZIZgWzA2td/vEJDdop66/XoBPmZ
// Dz/g2Tj8hARhhMutYJMXWKqM+aA5UJUsvBbI+a5ilNze1vvxWL8TiMo8Uat5Q2CN
// UvDKCCwhvE3UW465ZsP9lESnNXK3I9i0pk5r65PBcdVsPYIbD6+UCgT2rwKBgQDU
// De3OuYczanDUf1BBRFEbzwuNJ38HPnZB6F02PqogUo6+XUV41B8spgp3jTLJVKq5
// koXnWwBuWbDC973DOX2vlPB6eGfeKaRDtwsfU9yK0uVHQlFyos2ZyuSgDhBNg0q8
// AD+wGW8hva9+QbjsBm/744PizsRgfgydgMPqiCPI5QKBgEG+d9FeHJgcXNFXVn5g
// 0AjudCJM2byIYZnb4wwAXCHjw5sV53eu7SxJ6E0Vyr4vdWrp334M0E7Jg/lauCqL
// LEjwpFiJSCmKEZRSF9MY5L3J/6rMIFp9gvebyoHcoGjBt2kvw3p1Sg1gosJ0IdPJ
// IT6Rc+piu2/8va5ZC23NbFy7
//   -----END PRIVATE KEY-----`;

//   constructor(private http: HttpClient) {
//     console.log('KeyService: constructor called.');
//     this.initializePrivateKey();
//   }

//   async initializePrivateKey() {
//     try {
//       console.log('KeyService: Initializing private key.');
//       this.privateKey = await this.importPrivateKey(this.privateKeyPem);
//       console.log('KeyService: Private key initialized successfully.');
//       console.log('Private Key:', this.privateKey);
//     } catch (error) {
//       console.error('KeyService: Error initializing private key:', error);
//     }
//   }

//   getPublicKey(username: string): Observable<CryptoKey> {
//     const url = `http://localhost:3000/publicKey/${username}`;
//     console.log(`KeyService: Fetching public key from URL: ${url}`);
//     console.log(`KeyService: Fetching public key for username: ${username}`);
//     return this.http.get<{ publicKey: string }>(url).pipe(
//       switchMap((response) => {
//         console.log(
//           `Received public key for ${username}: ${response.publicKey}`
//         );
//         return from(this.importPublicKey(response.publicKey));
//       })
//     );
//   }

//   public async importPrivateKey(pem: string): Promise<CryptoKey> {
//     console.log('KeyService: Importing private key.');
//     const binaryDer = this.pemToBinary(pem);
//     const cryptoKey = await crypto.subtle.importKey(
//       'pkcs8',
//       binaryDer,
//       { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
//       true,
//       ['sign']
//     );
//     console.log('KeyService: Private key imported successfully.');
//     return cryptoKey;
//   }

//   private async importPublicKey(pem: string): Promise<CryptoKey> {
//     console.log('KeyService: Importing public key.');
//     const binaryDer = this.pemToBinary(pem);
//     const cryptoKey = await crypto.subtle.importKey(
//       'spki',
//       binaryDer,
//       { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
//       true,
//       ['verify']
//     );
//     console.log('KeyService: Public key imported successfully.');
//     return cryptoKey;
//   }

//   private pemToBinary(pem: string): ArrayBuffer {
//     console.log('KeyService: Converting PEM to binary.');
//     const b64 = pem.replace(
//       /-----BEGIN (PUBLIC|PRIVATE) KEY-----|-----END (PUBLIC|PRIVATE) KEY-----|\s/g,
//       ''
//     );
//     const binaryString = atob(b64);
//     const len = binaryString.length;
//     const bytes = new Uint8Array(len);
//     for (let i = 0; i < len; i++) {
//       bytes[i] = binaryString.charCodeAt(i);
//     }
//     console.log('KeyService: Conversion to binary completed.');
//     return bytes.buffer;
//   }

//   async signMessage(message: string): Promise<string> {
//     console.log(`KeyService: Signing message: ${message}`);
//     const encoder = new TextEncoder();
//     const data = encoder.encode(message);
//     const signature = await crypto.subtle.sign(
//       'RSASSA-PKCS1-v1_5',
//       this.privateKey,
//       data
//     );
//     const signatureString = btoa(
//       String.fromCharCode(...new Uint8Array(signature))
//     );
//     console.log(
//       'KeyService: Message signed successfully. Signature:',
//       signatureString
//     );
//     console.log(`Signed message: ${message}`);
//     console.log(`Signature: ${signatureString}`);
//     return signatureString;
//   }

//   async verifySignature(
//     message: string,
//     signature: string,
//     publicKey: CryptoKey
//   ): Promise<boolean> {
//     console.log(`KeyService: Verifying signature for message: ${message}`);
//     console.log(`Signature to verify (Base64): ${signature}`);
//     console.log(`Public Key:`, publicKey);
//     const encoder = new TextEncoder();
//     const data = encoder.encode(message);
//     const sigBuffer = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
//     console.log(`Signature buffer:`, sigBuffer);
//     const isValid = await crypto.subtle.verify(
//       'RSASSA-PKCS1-v1_5',
//       publicKey,
//       sigBuffer,
//       data
//     );
//     console.log(`Verifying message: ${message}`);
//     console.log(`Using signature: ${signature}`);
//     console.log(`Verification result: ${isValid}`);
//     return isValid;
//   }
//   async verifyKeyPair(): Promise<void> {
//     const testMessage = 'test';
//     const signature = await this.signMessage(testMessage);
//     const isValid = await this.verifySignature(
//       testMessage,
//       signature,
//       this.publicKey
//     );
//     if (isValid) {
//       console.log('The private key and public key are a matching pair.');
//     } else {
//       console.error('The private key and public key do not match.');
//     }
//   }

//   async fetchAndVerifyPublicKey(username: string) {
//     console.log(`KeyService: Fetching public key for username: ${username}`);
//     this.getPublicKey(username).subscribe(
//       async (publicKey) => {
//         this.publicKey = publicKey;
//         console.log('KeyService: Public key imported successfully.');
//         await this.verifyKeyPair(); // Verify key pair here
//       },
//       (error) => {
//         console.error('Error fetching public key:', error);
//       }
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class KeyService {
  private privateKey!: CryptoKey;
  public publicKey!: CryptoKey;
  private privateKeyPem: string = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDC3Qy7F/gKKEq+
6K7+fKdnettxlWzgB9R/RAuPu0awcswEmDRh0y53gQBXGntBogM46JFmmEjRr5QJ
X4K4NlkurLUA5DzuJ0gXcL2CDNtzBgfyLEbhooNJBuwpvcGMbE2rDELN8lhgWpdl
G9fqVrYVJTPMFwUoY9GaSZwf066uEstTRw9LTS6B3KPTw2MopMka2IGzbxbij6ro
c1PiMCkTGU0+uiMWFoWQtcHbBep5uKekITO1IuLZYN18tv6i3H/QH/LXw/oE22hg
+4V2DKBGEgYkIPt7cXc7/iwBs2a954C9vbynzED7oW2rvmG1NHdkVYZWccMQswFt
zso1CVvJAgMBAAECggEAHjZJkARyV5jRpfHLl/dZuSiKN30UaVOtdaHmLP27QwY5
bYjvri8g6DRfCiI39AAbgcpFKOP5flE7oYxmZws+Hod2dNHuRHpgqgm3yB8YMyg/
OSP2RWt98WeaXApopM3x6NA411d4rk+9Y1bCzjltd6/R7RWwngeD6uj4xNJ8Jc7M
2NpCTQ8wXmF6ngNZ1gB0nR6GJStpdGMHvSeoumdzk7XArZD5kPEQgrCTqppvyqvC
2DwS1cdnhfcxWc0+P2YHFUG2+4enIYSsN4FGlESSfWg76gZevaejW1gNhcGQwk5n
BZ4q87D1tCZBkEn2GQmfaR20AtC4ptE/f2WP++jyVQKBgQDokKm4/gRJN9ikICjW
jdfkPw7tQ86IhujFQOmCo0pHVGFGdzR98iDx1TZNIH5DyGDPP6o0L75vJqtDaeQO
udgiYImc3SDiQMz0zctvJVfR+I9Ep7F6/tebsUvmr83Io8rwUwjD4UEnuVwSUgYp
JZPUwxpRsuuFEso6ycNyaPS9nwKBgQDWf9JXmp5+zyv1CC6YXJAcEfOsRxNM+9NW
N93rS4qAl2hGyk1bhk1eOcuItAbyxuu5JsqEBaAuIInumczqGW8Gm+JQ6KhRDbRc
8iiAZSKVdvzW8fXLNmzVv14TFk9e3gtMNxQxMHZ0W+UFUrpAf07+hS/j4LP7vgTV
o/EoCr2dlwKBgQDlz7X3eQPROl9Y5/KS+b2B7ZIZgWzA2td/vEJDdop66/XoBPmZ
Dz/g2Tj8hARhhMutYJMXWKqM+aA5UJUsvBbI+a5ilNze1vvxWL8TiMo8Uat5Q2CN
UvDKCCwhvE3UW465ZsP9lESnNXK3I9i0pk5r65PBcdVsPYIbD6+UCgT2rwKBgQDU
De3OuYczanDUf1BBRFEbzwuNJ38HPnZB6F02PqogUo6+XUV41B8spgp3jTLJVKq5
koXnWwBuWbDC973DOX2vlPB6eGfeKaRDtwsfU9yK0uVHQlFyos2ZyuSgDhBNg0q8
AD+wGW8hva9+QbjsBm/744PizsRgfgydgMPqiCPI5QKBgEG+d9FeHJgcXNFXVn5g
0AjudCJM2byIYZnb4wwAXCHjw5sV53eu7SxJ6E0Vyr4vdWrp334M0E7Jg/lauCqL
LEjwpFiJSCmKEZRSF9MY5L3J/6rMIFp9gvebyoHcoGjBt2kvw3p1Sg1gosJ0IdPJ
IT6Rc+piu2/8va5ZC23NbFy7
  -----END PRIVATE KEY-----`;

  constructor(private http: HttpClient, private apiService: ApiService) {
    console.log('KeyService: constructor called.');
    this.initializePrivateKey();
  }

  async initializePrivateKey() {
    try {
      console.log('KeyService: Initializing private key.');
      this.privateKey = await this.importPrivateKey(this.privateKeyPem);
      console.log('KeyService: Private key initialized successfully.');
      console.log('Private Key:', this.privateKey);
    } catch (error) {
      console.error('KeyService: Error initializing private key:', error);
    }
  }

  getPublicKey(username: string): Observable<CryptoKey> {
    console.log(`KeyService: Fetching public key for username: ${username}`);
    return this.apiService.getPublicKey(username).pipe(
      switchMap((publicKeyPem) => {
        console.log(`Received public key for ${username}: ${publicKeyPem}`);
        return from(this.importPublicKey(publicKeyPem));
      }),
      catchError((error) => {
        console.error(`Error fetching public key for ${username}:`, error);
        throw error;
      })
    );
  }
  // getPublicKey(username: string): Observable<CryptoKey> {
  //   const url = `http://localhost:3000/publicKey/${username}`;
  //   console.log(`KeyService: Fetching public key from URL: ${url}`);
  //   console.log(`KeyService: Fetching public key for username: ${username}`);
  //   return this.http.get<{ publicKey: string }>(url).pipe(
  //     switchMap((response) => {
  //       console.log(
  //         `Received public key for ${username}: ${response.publicKey}`
  //       );
  //       return from(this.importPublicKey(response.publicKey));
  //     })
  //   );
  // }

  public async importPrivateKey(pem: string): Promise<CryptoKey> {
    console.log('KeyService: Importing private key.');
    const binaryDer = this.pemToBinary(pem);
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      true,
      ['sign']
    );
    console.log('KeyService: Private key imported successfully.');
    return cryptoKey;
  }

  private async importPublicKey(pem: string): Promise<CryptoKey> {
    console.log('KeyService: Importing public key.');
    const binaryDer = this.pemToBinary(pem);
    const cryptoKey = await crypto.subtle.importKey(
      'spki',
      binaryDer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      true,
      ['verify']
    );
    console.log('KeyService: Public key imported successfully.');
    return cryptoKey;
  }

  private pemToBinary(pem: string): ArrayBuffer {
    console.log('KeyService: Converting PEM to binary.');
    const b64 = pem.replace(
      /-----BEGIN (PUBLIC|PRIVATE) KEY-----|-----END (PUBLIC|PRIVATE) KEY-----|\s/g,
      ''
    );
    const binaryString = atob(b64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    console.log('KeyService: Conversion to binary completed.');
    return bytes.buffer;
  }

  async signMessage(message: string): Promise<string> {
    console.log(`KeyService: Signing message: ${message}`);
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      this.privateKey,
      data
    );
    const signatureString = btoa(
      String.fromCharCode(...new Uint8Array(signature))
    );
    console.log(
      'KeyService: Message signed successfully. Signature:',
      signatureString
    );
    console.log(`Signed message: ${message}`);
    console.log(`Signature: ${signatureString}`);
    return signatureString;
  }

  async verifySignature(
    message: string,
    signature: string,
    publicKey: CryptoKey
  ): Promise<boolean> {
    console.log(`KeyService: Verifying signature for message: ${message}`);
    console.log(`Signature to verify (Base64): ${signature}`);
    console.log(`Public Key:`, publicKey);
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const sigBuffer = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
    console.log(`Signature buffer:`, sigBuffer);
    const isValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      sigBuffer,
      data
    );
    console.log(`Verifying message: ${message}`);
    console.log(`Using signature: ${signature}`);
    console.log(`Verification result: ${isValid}`);
    return isValid;
  }
  async verifyKeyPair(): Promise<void> {
    const testMessage = 'test';
    const signature = await this.signMessage(testMessage);
    const isValid = await this.verifySignature(
      testMessage,
      signature,
      this.publicKey
    );
    if (isValid) {
      console.log('The private key and public key are a matching pair.');
    } else {
      console.error('The private key and public key do not match.');
    }
  }

  async fetchAndVerifyPublicKey(username: string): Promise<void> {
    console.log(`KeyService: Fetching public key for username: ${username}`);
    try {
      const fetchedKey = await this.getPublicKey(username).toPromise();
      if (fetchedKey) {
        this.publicKey = fetchedKey;
        console.log(
          'KeyService: Public key imported successfully.',
          this.publicKey
        );
        await this.verifyKeyPair(); // Verify key pair here
      } else {
        throw new Error('Failed to fetch public key or received invalid data.');
      }
    } catch (error) {
      console.error('Error fetching public key:', error);
      throw error; // Propagate the error up
    }
  }
}
