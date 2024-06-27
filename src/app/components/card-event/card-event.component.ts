import { Component, Input, inject, input } from '@angular/core';
import { TEvent } from '../../data/event';
import { TruncateNamePipe } from '../../pipes/truncate-name.pipe';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalDetailEventComponent } from '../modal-detail-event/modal-detail-event.component';
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
    this.modalService.openModalDetailEvent(this.event().id);
  }
}
