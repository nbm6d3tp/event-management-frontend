import { Component, Input, inject, input } from '@angular/core';
import { TEvent } from '../../data/event';
import { TruncateNamePipe } from '../../pipes/truncate-name.pipe';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalDetailEventComponent } from '../modal-detail-event/modal-detail-event.component';

@Component({
  selector: 'app-card-event',
  templateUrl: './card-event.component.html',
  styleUrl: './card-event.component.css',
})
export class CardEventComponent {
  event = input.required<TEvent>();
  readonly dialog = inject(MatDialog);

  constructor() {}

  onClick() {
    const dialogRef = this.dialog.open(ModalDetailEventComponent, {
      data: this.event().id,
      height: '80%',
      width: '40%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log({ result });
    });
  }
}
