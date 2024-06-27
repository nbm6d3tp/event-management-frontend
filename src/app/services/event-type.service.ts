import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TTypeEvent } from '../data/event';

@Injectable({
  providedIn: 'root',
})
export class EventTypeService {
  url = 'http://localhost:8080/v1/typesEvent';

  constructor(private http: HttpClient) {}

  getAll() {
    console.log('Get all types event');
    return this.http.get<TTypeEvent[]>(this.url);
  }
}
