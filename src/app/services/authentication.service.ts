import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TPerson, people } from '../data/person';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject: BehaviorSubject<TPerson | null>;
  public user: Observable<TPerson | null>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(email: string, password: string) {
    const user = people.find(
      (person) => person.email === email && person.password === password
    );
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      user.authdata = window.btoa(email + ':' + password);
      this.userSubject.next(user);
      return of(user);
    }
    return of();
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
