import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { TCreateEvent, TEvent, TEventResponse, TFilters } from '../data/event';
import { convertDateArrayToDateInstance } from '../helpers/dateTime';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  url = 'http://localhost:8080/v1/events';
  private eventsSubject = new BehaviorSubject<TEvent[]>([]);
  events$ = this.eventsSubject.asObservable();

  private myEventsSubject = new BehaviorSubject<TEvent[]>([]);
  myEvents$ = this.myEventsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.reloadEvents();
  }

  public reloadEvents(): void {
    this.getAll().subscribe((events) => {
      this.eventsSubject.next(events);
    });
  }

  public reloadMyEvents(): void {
    this.getMyEvents().subscribe((events) => {
      this.myEventsSubject.next(events);
    });
  }

  getAll(): Observable<TEvent[]> {
    const token = localStorage.getItem('user');
    return this.http
      .get<TEventResponse[]>(this.url, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      })
      .pipe(
        map((events) => {
          return events.map(
            (event) =>
              ({
                ...event,
                startTime: convertDateArrayToDateInstance(event.startTime),
                endTime: convertDateArrayToDateInstance(event.endTime),
                feedbacks: event.feedbacks
                  ? event.feedbacks?.map((feedback) => ({
                      ...feedback,
                      date: convertDateArrayToDateInstance(feedback.date),
                    }))
                  : undefined,
              } as TEvent)
          );
        })
      );
  }

  getEvent(id: string): Observable<TEvent> {
    return this.http.get<TEventResponse>(this.url + '/' + id).pipe(
      map((event) => {
        return {
          ...event,
          startTime: convertDateArrayToDateInstance(event.startTime),
          endTime: convertDateArrayToDateInstance(event.endTime),
          feedbacks: event.feedbacks
            ? event.feedbacks?.map((feedback) => ({
                ...feedback,
                date: convertDateArrayToDateInstance(feedback.date),
              }))
            : undefined,
        } as TEvent;
      })
    );
  }

  editEvent(id: string, editedEvent: TCreateEvent): Observable<TEvent> {
    return this.http.put<TEventResponse>(this.url + '/' + id, editedEvent).pipe(
      map((event) => {
        return {
          ...event,
          startTime: convertDateArrayToDateInstance(event.startTime),
          endTime: convertDateArrayToDateInstance(event.endTime),
          feedbacks: event.feedbacks
            ? event.feedbacks?.map((feedback) => ({
                ...feedback,
                date: convertDateArrayToDateInstance(feedback.date),
              }))
            : undefined,
        } as TEvent;
      }),
      tap(() => {
        this.reloadEvents();
        this.reloadMyEvents();
      })
    );
  }

  deleteEvent(id: string) {
    return this.http.delete(this.url + '/' + id).pipe(
      tap(() => {
        this.reloadEvents();
        this.reloadMyEvents();
      })
    );
  }

  createEvent(event: TCreateEvent): Observable<TEvent> {
    return this.http.post<TEventResponse>(this.url, event).pipe(
      map((event) => {
        return {
          ...event,
          startTime: convertDateArrayToDateInstance(event.startTime),
          endTime: convertDateArrayToDateInstance(event.endTime),
          feedbacks: event.feedbacks
            ? event.feedbacks?.map((feedback) => ({
                ...feedback,
                date: convertDateArrayToDateInstance(feedback.date),
              }))
            : undefined,
        } as TEvent;
      }),
      tap(() => {
        this.reloadEvents();
        this.reloadMyEvents();
      })
    );
  }

  filterEvents(filters: TFilters): Observable<TEvent[]> {
    const newQueryParameterObject = Object.entries(filters).reduce(
      (acc, [key, value]) => ({
        ...acc,
        ...(value != null &&
          value != '' &&
          value.length > 0 && { [key]: value }),
      }),
      {}
    );
    const queryParams = new HttpParams({ fromObject: newQueryParameterObject });
    return this.http
      .get<TEventResponse[]>(this.url + '/' + 'search', {
        params: queryParams,
      })
      .pipe(
        map((events) => {
          return events.map(
            (event) =>
              ({
                ...event,
                startTime: convertDateArrayToDateInstance(event.startTime),
                endTime: convertDateArrayToDateInstance(event.endTime),
                feedbacks: event.feedbacks
                  ? event.feedbacks?.map((feedback) => ({
                      ...feedback,
                      date: convertDateArrayToDateInstance(feedback.date),
                    }))
                  : undefined,
              } as TEvent)
          );
        })
      );
  }

  getMyEvents(): Observable<TEvent[]> {
    return this.http.get<TEventResponse[]>(this.url + '/' + 'my').pipe(
      map((events) => {
        return events.map(
          (event) =>
            ({
              ...event,
              startTime: convertDateArrayToDateInstance(event.startTime),
              endTime: convertDateArrayToDateInstance(event.endTime),
              feedbacks: event.feedbacks
                ? event.feedbacks?.map((feedback) => ({
                    ...feedback,
                    date: convertDateArrayToDateInstance(feedback.date),
                  }))
                : undefined,
            } as TEvent)
        );
      })
    );
  }
}
