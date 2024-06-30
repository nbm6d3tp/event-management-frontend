import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddEventComponent } from '../components/modal-add-event/modal-add-event.component';
import { ModalDetailEventComponent } from '../components/modal-detail-event/modal-detail-event.component';
import { ModalFeedbackComponent } from '../components/modal-feedback/modal-feedback.component';
import { TEvent } from '../data/event';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  readonly dialog = inject(MatDialog);

  constructor() {}

  openModalAddEvent(event?: TEvent, onSuccess?: () => void) {
    const dialogRef = this.dialog.open(ModalAddEventComponent, {
      height: '500px',
      width: '600px',
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (onSuccess) onSuccess();
    });
  }

  openModalFeedback(idEvent?: string, onSuccess?: () => void) {
    const dialogRef = this.dialog.open(ModalFeedbackComponent, {
      height: '280px',
      width: '500px',
      data: {
        idEvent,
        onSuccess,
      },
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  openModalDetailEvent(eventID: string) {
    const dialogRef = this.dialog.open(ModalDetailEventComponent, {
      data: eventID,
      height: '500px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
