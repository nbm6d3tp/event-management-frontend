import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TCreateFeedback, TFeedback } from '../data/review';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  url = 'http://localhost:8080/v1/feedback';

  constructor(private http: HttpClient) {}

  getFeedbacks(idEvent: string) {
    console.log('Get feedbacks for event ', idEvent);
    return this.http.get<TFeedback[]>(this.url + '/event/' + idEvent);
  }

  deleteFeedback(idEvent: string) {
    console.log('Delete feedback for event ', idEvent);
    return this.http.delete<TFeedback[]>(this.url + '/event/' + idEvent);
  }

  createFeedback(data: TCreateFeedback) {
    console.log('Create feedback ', data);
    return this.http.post<TFeedback>(this.url, data);
  }
}
