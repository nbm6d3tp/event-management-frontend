import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TUser } from '../../data/person';
import { canComment } from '../../my-events/my-events.component';
import { AuthenticationService } from '../../services/authentication.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  user?: TUser | null;
  upcomingEventsCount: number = 0;
  eventsToFeedbackCount: number = 0;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private eventsService: EventsService
  ) {
    this.authenticationService.user.subscribe((person) => {
      this.user = person;
      if (person) {
        this.eventsService.reloadMyEvents();
        this.eventsService.myEvents$.subscribe((events) => {
          this.upcomingEventsCount = events.filter(
            (event) => event.endTime.getTime() > new Date().getTime()
          ).length;
          this.eventsToFeedbackCount = events.filter((event) =>
            canComment(event, person)
          ).length;
        });
      }
    });
  }

  onClickAvatar() {
    this.router.navigate(['/my-profile']);
  }
}
