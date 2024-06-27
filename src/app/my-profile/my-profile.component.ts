import { Component } from '@angular/core';
import { TUser } from '../data/person';
import { AuthenticationService } from '../services/authentication.service';
import { TEvent } from '../data/event';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent {
  user?: TUser | null;
  myEvents: TEvent[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    eventsService: EventsService,
  ) {
    this.authenticationService.user.subscribe((person) => {
      this.user = person;
      if (person)
        eventsService
          .getMyEvents()
          .subscribe(
            (events) =>
              (this.myEvents = events.filter(
                (event) => event.organizer.email == person.email,
              )),
          );
    });
  }

  onClickLogout() {
    this.authenticationService.logout();
  }
}
