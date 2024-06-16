import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TEvent, eventData } from '../data/event';

@Injectable({
  providedIn: 'root',
})
export class MyEventsService {
  constructor() {}

  getAll(): Observable<TEvent[]> {
    return of(eventData);
  }
}
