import { Component, signal } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TEvent } from '../data/event';
import { TUser } from '../data/person';
import { AuthenticationService } from '../services/authentication.service';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent {
  user?: TUser | null;
  eventsOrganizedByMe: TEvent[] = [];
  lang = signal(this.translateService.getDefaultLang());

  constructor(
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    eventsService: EventsService
  ) {
    this.translateService.onDefaultLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.lang.set(event.lang);
      }
    );
    this.authenticationService.user.subscribe((person) => {
      this.user = person;
      if (person)
        eventsService.myEvents$.subscribe((myEvents) => {
          this.eventsOrganizedByMe = myEvents.filter(
            (event) => event.organizer.email == person.email
          );
        });
    });
  }

  onClickLogout() {
    this.authenticationService.logout();
  }

  onChange(event: MatRadioChange) {
    this.translateService.setDefaultLang(event.value);
  }
}
