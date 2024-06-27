import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TEvent } from '../../data/event';
import { EventsService } from '../../services/events.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../services/authentication.service';
import { TPerson } from '../../data/person';
import {
  canCancel,
  canComment,
  canDelete,
  canEdit,
  canParticipate,
} from '../../my-events/my-events.component';
import { ToastService } from '../../services/toast.service';
import { ModalFeedbackComponent } from '../modal-feedback/modal-feedback.component';
import { ModalAddEventComponent } from '../modal-add-event/modal-add-event.component';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal-detail-event',
  templateUrl: './modal-detail-event.component.html',
  styleUrl: './modal-detail-event.component.css',
})
export class ModalDetailEventComponent {
  readonly dialogRef = inject(MatDialogRef<ModalDetailEventComponent>);
  readonly eventID = inject<string>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
  data:
    | {
        event: TEvent;
        isError: false;
      }
    | {
        event: null;
        isError: true;
      } = {
    event: null,
    isError: true,
  };
  user?: TPerson | null;

  constructor(
    private eventsService: EventsService,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private modalService: ModalService
  ) {
    authenticationService.user.subscribe((person) => {
      this.user = person;
    });
    eventsService.getEvent(this.eventID).subscribe((event) => {
      if (!event) {
        console.error('Event not found');
        this.data = { event: null, isError: true };
        return;
      }
      this.data = { event, isError: false };
      return;
    });
  }
  canDelete = canDelete;

  canEdit = canEdit;

  canCancel = canCancel;

  canParticipate = canParticipate;

  canComment = canComment;

  onClose() {
    this.dialogRef.close();
  }

  onCancel() {
    console.log('Cancel');
    this.toastService.showToastWithConfirm('cancel', () => {
      this.dialogRef.close();
    });
  }

  onParticipate() {
    this.toastService.showToast('success', 'Participate');
    this.dialogRef.close();
    console.log('Participate');
  }

  onComment() {
    this.modalService.openModalFeedback();
  }

  onDelete() {
    this.toastService.showToastWithConfirm('delete', () => {
      this.dialogRef.close();
    });
    console.log('Delete');
  }

  onEdit() {
    if (!this.data.event) return;
    this.modalService.openModalAddEvent(this.data.event.id);
    console.log('Edit');
  }
}
