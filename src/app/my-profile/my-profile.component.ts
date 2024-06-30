import { Component, signal } from '@angular/core';
import { TUser } from '../data/person';
import { AuthenticationService } from '../services/authentication.service';
import { TEvent } from '../data/event';
import { EventsService } from '../services/events.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent {
  user?: TUser | null;
  myEvents: TEvent[] = [];
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
    console.log(this.translateService.currentLang);
    this.authenticationService.user.subscribe((person) => {
      this.user = person;
      if (person)
        eventsService
          .getMyEvents()
          .subscribe(
            (events) =>
              (this.myEvents = events.filter(
                (event) => event.organizer.email == person.email
              ))
          );
    });
  }

  onClickLogout() {
    this.authenticationService.logout();
  }

  onChange(event: MatRadioChange) {
    console.log(event.value);
    this.translateService.setDefaultLang(event.value);
  }
}
