import { Injectable } from '@angular/core';
import { TCreateEvent, TEvent, TFilters } from '../data/event';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  url = 'http://localhost:8080/v1/events/';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<TEvent[]>(this.url);
  }

  getEvent(id: string) {
    return this.http.get<TEvent>(this.url + id);
  }

  editEvent(id: string, editedEvent: TCreateEvent) {
    return this.http.put<TEvent>(this.url + id, editedEvent);
  }

  deleteEvent(id: string) {
    return this.http.delete(this.url + id);
  }

  createEvent(event: TCreateEvent) {
    return this.http.post<TEvent>(this.url, event);
  }

  filterEvents(filters: TFilters) {
    const refinedFilters = {
      ...filters,
      startDate: filters.startDate.toString(),
      endDate: filters.endDate.toString(),
    };
    const queryParams = new HttpParams({ fromObject: refinedFilters });
    return this.http.get<TEvent[]>(this.url + 'search', {
      params: queryParams,
    });
  }

  getMyEvents() {
    return this.http.get<TEvent[]>(this.url + 'my');
  }
}
