import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

function parseJwt(token?: string) {
  console.log({ token });
  if (!token) return undefined;
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  console.log('jsonPayload', jsonPayload);

  return JSON.parse(jsonPayload);
}

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const decodedToken = parseJwt(localStorage.getItem('user')!);

    if (
      decodedToken &&
      decodedToken.exp >= Math.floor(new Date().getTime() / 1000)
    ) {
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
