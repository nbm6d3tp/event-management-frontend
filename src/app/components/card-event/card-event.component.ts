import { Component, input } from '@angular/core';
import { TEvent } from '../../data/event';
import { ModalService } from '../../services/modal.service';
import { AuthenticationService } from '../../services/authentication.service';
import { TUser } from '../../data/person';

@Component({
  selector: 'app-card-event',
  templateUrl: './card-event.component.html',
  styleUrl: './card-event.component.css',
})
export class CardEventComponent {
  event = input.required<TEvent>();
  user?: TUser;

  constructor(
    private modalService: ModalService,
    private authenticationService: AuthenticationService
  ) {
    authenticationService.user.subscribe((person) => {
      this.user = person;
    });
  }

  isParticipating() {
    if (!this.user) {
      return false;
    }
    return this.event()
      .participants.map((participant) => participant.email)
      .includes(this.user.email);
  }

  onClick() {
    this.modalService.openModalDetailEvent(this.event().idEvent);
  }

  isEnded() {
    return this.event().endTime.getTime() < new Date().getTime();
  }
}
