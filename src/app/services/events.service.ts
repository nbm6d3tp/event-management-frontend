import { Injectable } from '@angular/core';
import { TEvent, eventData } from '../data/event';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor() {}

  getEvent(id: string) {
    return of(eventData.find((event) => event.id === id));
  }

  getAll() {
    return of(eventData);
  }
}
