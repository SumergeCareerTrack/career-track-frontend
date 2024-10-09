import { DestroyRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user.model';
import { BehaviorSubject, Subscription, tap } from 'rxjs';
import { AuthResponseData } from '../../interfaces/auth-response-data';
import { UserResponse } from '../../interfaces/backend-requests';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<UserResponse | null>(null);
  baseURL = 'http://localhost:8080';

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private destroyRef: DestroyRef
  ) {}

  autoLogin() {
    const userData = this.cookieService.get('UserData');
    if (!userData) {
      return;
    }
    console.log('User Data: ', userData);
    const user: UserResponse = JSON.parse(userData);
    this.user.next(user);
  }

  logOut() {
    this.cookieService.delete('token');
    this.cookieService.delete('UserData');
  }

  logIn(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(
        this.baseURL + '/auth/login',
        {
          email,
          password,
        },
        { headers: {} }
      )
      .pipe(
        tap((tokenData) => {
          this.cookieService.set('token', tokenData.token);

          const subscription = this.getUserByEmail(email).subscribe(
            (userData: any) => {
              this.handleLoginProcess(userData);
            }
          );
          this.destroySubsription(subscription);
        })
      );
  }

  handleLoginProcess(userResponse: UserResponse) {
    this.user.next(userResponse);
    this.cookieService.set('UserData', JSON.stringify(userResponse));
    this.cookieService.set('isAdmin',userResponse.department.name === 'HR' ? 'true' : 'false');
  }

  createUser(newUser: User) {
    return this.httpClient.post(this.baseURL + '/auth/register', newUser);
  }

  getUserByEmail(email: string) {
    return this.httpClient.get(this.baseURL + '/users/email/' + email);
  }

  handleAuthData(token: string, email: string) {
    this.getUserByEmail(email).subscribe((response: any) => {});
  }

  destroySubsription(subscription: Subscription) {
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  getToken() {
    return this.cookieService.get('token');
  }
}
