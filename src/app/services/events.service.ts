import { Injectable } from '@angular/core';
import { TCreateEvent, TEvent, TFilters } from '../data/event';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { TFeedback } from '../data/review';

export type TDateResponse = [
  number,
  number,
  number,
  number,
  number,
  ...number[]
];
export type TEventResponse = Omit<
  TEvent,
  'startTime' | 'endTime' | 'feedbacks'
> & {
  startTime: TDateResponse;
  endTime: TDateResponse;
  feedbacks: TFeedbackResponse[];
};

type TFeedbackResponse = Omit<TFeedback, 'date'> & { date: TDateResponse };

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
    console.log('Get all events');
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
    console.log('Get event ', id);
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
    console.log('Edit event ', editedEvent);
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
    console.log('Delete event ', id);
    return this.http.delete(this.url + '/' + id).pipe(
      tap(() => {
        this.reloadEvents();
        this.reloadMyEvents();
      })
    );
  }

  createEvent(event: TCreateEvent): Observable<TEvent> {
    console.log('Create event ', event);
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
    console.log('Filter events ', filters);
    const newQueryParameterObject = Object.entries(filters).reduce(
      (acc, [key, value]) => ({
        ...acc,
        ...(value != null &&
          value != '' &&
          value.length > 0 && { [key]: value }),
      }),
      {}
    );
    console.log('New filter events ', newQueryParameterObject);

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
    console.log('Get my events');
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
