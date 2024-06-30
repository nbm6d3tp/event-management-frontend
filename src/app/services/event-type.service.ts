import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TTypeEvent } from '../data/event';

@Injectable({
  providedIn: 'root',
})
export class EventTypeService {
  url = 'http://localhost:8080/v1/typesEvent';
  private eventTypesListSubject = new BehaviorSubject<TTypeEvent[]>([]);
  eventTypesList$ = this.eventTypesListSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getAll().subscribe((eventTypesList) => {
      this.eventTypesListSubject.next(
        eventTypesList.map((eventType) => eventType.name)
      );
    });
  }

  getAll() {
    const token = localStorage.getItem('user');
    return this.http.get<
      {
        idType: string;
        name: TTypeEvent;
      }[]
    >(this.url, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }
}
