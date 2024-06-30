import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = this.authenticationService.userValue;
    const isAuthUrl =
      !request.url.startsWith('http://localhost:8080/v1/auth/user') &&
      request.url.startsWith('http://localhost:8080/v1/auth');
    if (user && !isAuthUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('user')}`,
        },
      });
    }

    return next.handle(request);
  }
}
