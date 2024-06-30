import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { TUser } from '../data/person';
import { EventsService } from './events.service';

@Injectable({
  providedIn: 'root',
})
export class ParticipationService {
  url = 'http://localhost:8080/v1/participation/';

  constructor(
    private http: HttpClient,
    private eventsServices: EventsService
  ) {}

  participateEvent(idEvent: string) {
    return this.http
      .post(this.url + 'participate', { idEvent }, { responseType: 'text' })
      .pipe(
        tap(() => {
          this.eventsServices.reloadEvents();
          this.eventsServices.reloadMyEvents();
        })
      );
  }

  getParticipantsOfEvent(idEvent: string) {
    return this.http.get<TUser[]>(this.url + 'participants/' + idEvent);
  }

  cancelEvent(idEvent: string) {
    return this.http
      .delete(this.url + 'cancel/' + idEvent, { responseType: 'text' })
      .pipe(
        tap(() => {
          this.eventsServices.reloadEvents();
          this.eventsServices.reloadMyEvents();
        })
      );
  }
}
