import { Injectable } from '@angular/core';
import { TCreateEvent, TEvent, TFilters } from '../data/event';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export type TDateResponse = [
  number,
  number,
  number,
  number,
  number,
  ...number[]
];
export type TEventResponse = Omit<TEvent, 'startTime' | 'endTime'> & {
  startTime: TDateResponse;
  endTime: TDateResponse;
};

export const convertDateArrayToDateInstance = (dateArray: TDateResponse) => {
  return new Date(
    dateArray[0],
    dateArray[1] - 1,
    dateArray[2],
    dateArray[3],
    dateArray[4]
  );
};

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  url = 'http://localhost:8080/v1/events';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TEvent[]> {
    console.log('Get all events');
    return this.http.get<TEventResponse[]>(this.url).pipe(
      map((events) => {
        return events.map(
          (event) =>
            ({
              ...event,
              startTime: convertDateArrayToDateInstance(event.startTime),
              endTime: convertDateArrayToDateInstance(event.endTime),
            } as TEvent)
        );
      })
    );
  }

  getEvent(id: string): Observable<TEvent> {
    console.log('Get event ', id);
    return this.http.get<TEventResponse>(this.url + '/' + id).pipe(
      map((event) => {
        return {
          ...event,
          startTime: convertDateArrayToDateInstance(event.startTime),
          endTime: convertDateArrayToDateInstance(event.endTime),
        } as TEvent;
      })
    );
  }

  editEvent(id: string, editedEvent: TCreateEvent): Observable<TEvent> {
    console.log('Edit event ', id, editedEvent);
    return this.http.put<TEventResponse>(this.url + '/' + id, editedEvent).pipe(
      map((event) => {
        return {
          ...event,
          startTime: convertDateArrayToDateInstance(event.startTime),
          endTime: convertDateArrayToDateInstance(event.endTime),
        } as TEvent;
      })
    );
  }

  deleteEvent(id: string) {
    console.log('Delete event ', id);
    return this.http.delete(this.url + '/' + id);
  }

  createEvent(event: TCreateEvent): Observable<TEvent> {
    console.log('Create event ', event);
    return this.http.post<TEventResponse>(this.url, event).pipe(
      map((event) => {
        return {
          ...event,
          startTime: convertDateArrayToDateInstance(event.startTime),
          endTime: convertDateArrayToDateInstance(event.endTime),
        } as TEvent;
      })
    );
  }

  filterEvents(filters: TFilters) {
    const refinedFilters = {
      ...filters,
      startDate: filters.startDate.toString(),
      endDate: filters.endDate.toString(),
    };
    console.log('Filter events ', refinedFilters);
    const queryParams = new HttpParams({ fromObject: refinedFilters });
    return this.http.get<TEvent[]>(this.url + '/' + 'search', {
      params: queryParams,
    });
  }

  getMyEvents(): Observable<TEvent[]> {
    console.log('Get my events');
    return this.http.get<TEventResponse[]>(this.url + '/' + 'my').pipe(
      map((events) => {
        return events.map(
          (event) =>
            ({
              ...event,
              startTime: convertDateArrayToDateInstance(event.startTime),
              endTime: convertDateArrayToDateInstance(event.endTime),
            } as TEvent)
        );
      })
    );
  }
}
