import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { TUser, TUserRegisterData } from '../data/person';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  url = 'http://localhost:8080/v1/auth/';
  private userSubject: BehaviorSubject<TUser | undefined>;
  public user: Observable<TUser | undefined>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject(
      localStorage.getItem('user')
        ? ({
            email: localStorage.getItem('email'),
            firstname: localStorage.getItem('firstname'),
            lastname: localStorage.getItem('lastname'),
            avatar: localStorage.getItem('avatar'),
          } as TUser)
        : undefined
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  register(data: TUserRegisterData): Observable<TUser> {
    console.log('Register ', data);
    return this.http
      .post<TUser & { token: string }>(this.url + 'register', data)
      .pipe(
        map((value) => {
          console.log('register success', value);
          localStorage.setItem('user', value.token);
          localStorage.setItem('userEmail', value.email);
          localStorage.setItem('avatar', value.avatar);
          localStorage.setItem('firstname', value.firstname);
          localStorage.setItem('lastname', value.lastname);

          const user = {
            lastname: value.lastname,
            firstname: value.firstname,
            email: value.email,
            avatar: value.avatar,
          };
          this.userSubject.next(user);
          return user;
        })
      );
  }

  login(data: { email: string; password: string }) {
    console.log('Login ', data);

    return this.http
      .post<TUser & { token: string }>(this.url + 'login', data)
      .pipe(
        map((value) => {
          console.log('login', value);
          console.log('localstorage before', localStorage.getItem('user'));
          localStorage.setItem('user', value.token);
          const user = {
            lastname: value.lastname,
            firstname: value.firstname,
            email: value.email,
            avatar: value.avatar,
          };
          console.log('localstorage after', localStorage.getItem('user'));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    console.log('localstorage before', localStorage.getItem('user'));
    console.log('Logout');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('avatar');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');

    this.userSubject.next(undefined);
    console.log('localstorage after', localStorage.getItem('user'));

    this.router.navigate(['/login']);
  }
}
