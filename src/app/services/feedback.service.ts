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
    console.log('Get feedbacks for event ', idEvent);
    return this.http.get<TFeedback[]>(this.url + '/event/' + idEvent);
  }

  deleteFeedback(idEvent: string) {
    console.log('Delete feedback for event ', idEvent);
    return this.http
      .delete(this.url + '/' + idEvent, { responseType: 'text' })
      .pipe(
        tap(() => {
          this.eventsServices.reloadMyEvents();
        })
      );
  }

  createFeedback(data: TCreateFeedback) {
    console.log('Create feedback ', data);
    return this.http.post<TFeedback>(this.url, data).pipe(
      tap(() => {
        this.eventsServices.reloadMyEvents();
        this.eventsServices.reloadEvents();
      })
    );
  }
}
