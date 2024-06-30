import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { TCreateFeedback, TFeedback } from '../data/review';
import { EventsService } from './events.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  url = 'http://localhost:8080/v1/feedback';

  constructor(
    private http: HttpClient,
    private eventsServices: EventsService
  ) {}

  getFeedbacks(idEvent: string) {
    return this.http.get<TFeedback[]>(this.url + '/event/' + idEvent);
  }

  deleteFeedback(idEvent: string) {
    return this.http
      .delete(this.url + '/' + idEvent, { responseType: 'text' })
      .pipe(
        tap(() => {
          this.eventsServices.reloadMyEvents();
        })
      );
  }

  createFeedback(data: TCreateFeedback) {
    return this.http.post<TFeedback>(this.url, data).pipe(
      tap(() => {
        this.eventsServices.reloadMyEvents();
        this.eventsServices.reloadEvents();
      })
    );
  }
}
