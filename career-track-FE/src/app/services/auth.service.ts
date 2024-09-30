import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  baseURL = 'http://localhost:3000/auth';

  constructor(private httpClient: HttpClient) {}

  logIn(email: string, password: string) {
    return this.httpClient.post(this.baseURL, { email, password }).pipe();
  }

  logOut() {
    return this.httpClient.post(this.baseURL, {});
  }

  signUp(email: string, password: string) {
    return this.httpClient.post(this.baseURL, { email, password });
  }

  getUser() {
    return this.httpClient.get(this.baseURL);
  }
}
