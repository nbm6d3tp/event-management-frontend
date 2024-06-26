import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { TUser, TUserRegisterData } from '../data/person';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  url = 'http://localhost:8080/v1/auth/';
  private userSubject: BehaviorSubject<TUser | null>;
  public user: Observable<TUser | null>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  register(data: TUserRegisterData): Observable<TUser> {
    return this.http
      .post<TUser & { token: string }>(this.url + 'register', data)
      .pipe(
        map((value) => {
          console.log('register', value);
          localStorage.setItem('user', value.token);
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
    return this.http
      .post<TUser & { token: string }>(this.url + 'login', data)
      .pipe(
        map((value) => {
          console.log('login', value);
          localStorage.setItem('user', value.token);
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

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
