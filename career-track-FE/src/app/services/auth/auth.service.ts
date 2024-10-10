import { DestroyRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user.model';
import { BehaviorSubject, Subscription, switchMap, tap } from 'rxjs';
import { AuthResponseData } from '../../interfaces/auth-response-data';
import { UserResponse } from '../../interfaces/backend-requests';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<UserResponse | null>(null);
  baseURL = 'http://localhost:8080';

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {}

  autoLogin() {
    const userData = this.cookieService.get('UserData');
    if (!userData) {
      return;
    }
    const expiresAt = this.cookieService.get('expiresIn');
    const expirationDate = new Date(expiresAt);

    if (expirationDate < new Date()) {
      this.logOut();
      return;
    }

    const expirationDuration = expirationDate.getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
    const user: UserResponse = JSON.parse(userData);
    this.user.next(user);
  }

  autoLogout(expiresIn: number) {
    setTimeout(() => {
      this.logOut();
    }, expiresIn);
  }

  logOut() {
    this.cookieService.deleteAll();
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  logIn(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(this.baseURL + '/auth/login', {
        email,
        password,
      })
      .pipe(
        tap((tokenData) => {
          this.cookieService.set('token', tokenData.token);
        }),
        switchMap(() => {
          return this.getUserByEmail(email);
        }),
        tap((userData: any) => {
          this.handleLoginProcess(userData);
        })
      );
  }

  handleLoginProcess(userResponse: UserResponse) {
    this.user.next(userResponse);
    console.log('User Response: ', userResponse);
    this.cookieService.set('UserData', JSON.stringify(userResponse));
    this.cookieService.set(
      'isAdmin',
      userResponse.department.name === 'HR' ? 'true' : 'false'
    );
    this.cookieService.set(
      'isManager',
      userResponse.title.manager ? 'true' : 'false'
    );
    this.setExpiration();
  }

  setExpiration() {
    const expirationTime = new Date(new Date().getTime() + 3600 * 1000);
    this.cookieService.set('expiresIn', expirationTime.toString());
    this.autoLogout(3600 * 1000);
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
