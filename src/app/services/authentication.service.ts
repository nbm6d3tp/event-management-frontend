import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { TUser, TUserRegisterData } from '../data/person';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  url = 'http://localhost:8080/v1/auth/';
  private userSubject: BehaviorSubject<TUser | undefined>;
  public user: Observable<TUser | undefined>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<TUser | undefined>(undefined);
    this.user = this.userSubject.asObservable();
  }

  public initialize(): void {
    const token = localStorage.getItem('user');
    if (token) {
      this.http
        .get<TUser>(this.url + 'user', {
          headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
        })
        .subscribe(
          (user) => this.userSubject.next(user),
          (error) => {
            console.error('Error fetching user:', error);
            this.logout();
          }
        );
    }
  }

  getUserInfo(): Observable<TUser> {
    return this.http.get<TUser>(this.url + 'user');
  }

  public get userValue() {
    return this.userSubject.value;
  }

  register(data: TUserRegisterData): Observable<TUser> {
    return this.http
      .post<TUser & { token: string }>(this.url + 'register', data)
      .pipe(
        map((value) => {
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
    this.userSubject.next(undefined);

    this.router.navigate(['/login']);
  }
}
