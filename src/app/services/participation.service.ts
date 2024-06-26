import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TUser } from '../data/person';

@Injectable({
  providedIn: 'root',
})
export class ParticipationService {
  url = 'http://localhost:8080/v1/participation/';

  constructor(private http: HttpClient) {}

  participateEvent(idEvent: string) {
    return this.http.post(this.url + 'participate', idEvent);
  }

  getParticipantsOfEvent(idEvent: string) {
    return this.http.get<TUser[]>(this.url + 'participants/' + idEvent);
  }

  cancelEvent(idEvent: string) {
    return this.http.delete(this.url + 'cancel/' + idEvent);
  }
}
