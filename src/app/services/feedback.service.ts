import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TCreateFeedback, TFeedback } from '../data/review';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  url = 'http://localhost:8080/v1/feedback/';

  constructor(private http: HttpClient) {}

  getFeedbacks(idEvent: string) {
    return this.http.get<TFeedback[]>(this.url + 'event/' + idEvent);
  }

  deleteFeedback(idEvent: string) {
    return this.http.delete<TFeedback[]>(this.url + 'event/' + idEvent);
  }

  createFeedback(data: TCreateFeedback) {
    return this.http.post<TFeedback>(this.url, data);
  }
}
