import { Injectable, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { TUser, TUserRegisterData } from '../data/person';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  url = 'http://localhost:8080/v1/auth/';
  private userSubject: BehaviorSubject<TUser | undefined>;
  public user: Observable<TUser | undefined>;

  // constructor(private router: Router, private http: HttpClient) {
  //   // Initialize userSubject
  //   this.userSubject = new BehaviorSubject<TUser | undefined>(undefined);
  //   this.user = this.userSubject.asObservable();
  //   // this.userSubject = new BehaviorSubject(
  //   //   parseJwt(localStorage.getItem('user')!)
  //   // );
  //   // this.user = this.userSubject.asObservable();
  //   const token = localStorage.getItem('user');
  //   if (token) {
  //     console.log('Fetch user');
  //     this.http
  //       .get<TUser>(this.url + 'user', {
  //         headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
  //       })
  //       .subscribe({
  //         next: (user) => {
  //           this.userSubject.next(user);
  //           this.user = this.userSubject.asObservable();
  //         },
  //         error: (error) => {
  //           console.error('Error fetching user:', error);
  //           // this.logout();
  //         },
  //       });
  //   }
  // }

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
    console.log('Get user info');
    return this.http.get<TUser>(this.url + 'user');
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
    this.userSubject.next(undefined);
    console.log('localstorage after', localStorage.getItem('user'));

    this.router.navigate(['/login']);
  }
}
