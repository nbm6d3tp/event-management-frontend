import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddEventComponent } from '../components/modal-add-event/modal-add-event.component';
import { ModalFeedbackComponent } from '../components/modal-feedback/modal-feedback.component';
import { ModalDetailEventComponent } from '../components/modal-detail-event/modal-detail-event.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  readonly dialog = inject(MatDialog);

  constructor() {}

  openModalAddEvent(idEvent?: string) {
    const dialogRef = this.dialog.open(ModalAddEventComponent, {
      height: '500px',
      width: '600px',
      data: idEvent,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openModalFeedback() {
    const dialogRef = this.dialog.open(ModalFeedbackComponent, {
      height: '260px',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
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
