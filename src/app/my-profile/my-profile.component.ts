import { Component } from '@angular/core';
import { TPerson } from '../data/person';
import { AuthenticationService } from '../services/authentication.service';
import { TEvent, eventData } from '../data/event';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent {
  user?: TPerson | null;
  myEvents: TEvent[] = [];

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe((x) => {
      this.user = x;
      this.myEvents = eventData.filter((event) => event.organizer.id === x?.id);
    });
  }

  onClickLogout() {
    this.authenticationService.logout();
  }
}
