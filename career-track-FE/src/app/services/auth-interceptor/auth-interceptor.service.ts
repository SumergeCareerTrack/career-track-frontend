import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { exhaustMap, take } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(() => {
        if (!this.authService.getToken()) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          headers: req.headers.append(
            'Authorization',
            'Bearer ' + this.authService.getToken()
          ),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
