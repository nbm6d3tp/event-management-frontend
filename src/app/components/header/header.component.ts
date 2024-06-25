import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { TPerson } from '../../data/person';
import { EventsService } from '../../services/events.service';
import { TEvent } from '../../data/event';
import { canComment } from '../../my-events/my-events.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  user?: TPerson | null;
  upcomingEventsCount: number = 0;
  eventsToFeedbackCount: number = 0;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private eventsService: EventsService
  ) {
    this.authenticationService.user.subscribe((person) => {
      this.user = person;
      if (person)
        this.eventsService.getMyEvents(person.id).subscribe((events) => {
          this.upcomingEventsCount = events.filter(
            (event) => event.end.getTime() > new Date().getTime()
          ).length;
          this.eventsToFeedbackCount = events.filter((event) =>
            canComment(event, person)
          ).length;
        });
    });
  }

  onClickAvatar() {
    this.router.navigate(['/my-profile']);
  }
}
