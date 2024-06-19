import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://145.49.13.132:5055/api';

  constructor(private http: HttpClient) {}

  getPublicKey(username: string): Observable<string> {
    const url = `${this.baseUrl}/transparentPerson/${username}/publicKey`;
    return this.http.get<{ publicKey: string }>(url).pipe(
      map((response) => response.publicKey),
      catchError(this.handleError)
    );
  }

  getAllPersons(): Observable<string[]> {
    const url = `${this.baseUrl}/transparentPerson/usernames`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  getTransparentPerson(username: string): Observable<any> {
    const url = `${this.baseUrl}/transparentPerson/${username}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  getMessages(username: string): Observable<Message[]> {
    const url = `${this.baseUrl}/message/${username}`;
    return this.http.get<any[]>(url).pipe(
      tap((response) => console.log('Raw response:', response)),
      map((response) => response.map((item) => Message.fromJSON(item))),
      tap((messages) => console.log('Processed messages:', messages)),
      catchError(this.handleError)
    );
  }

  sendMessage(
    streamername: string,
    message: { username: string; text: string }
  ): Observable<any> {
    const url = `${this.baseUrl}/message/${streamername}`;
    return this.http.post<any>(url, message).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || 'Server error');
  }
}
