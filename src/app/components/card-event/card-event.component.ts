import { Component, input } from '@angular/core';
import { TEvent } from '../../data/event';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-card-event',
  templateUrl: './card-event.component.html',
  styleUrl: './card-event.component.css',
})
export class CardEventComponent {
  event = input.required<TEvent>();

  constructor(private modalService: ModalService) {}

  onClick() {
    this.modalService.openModalDetailEvent(this.event().idEvent);
  }
}
