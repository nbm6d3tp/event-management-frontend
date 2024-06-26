import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TEvent } from '../../data/event';
import { EventsService } from '../../services/events.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthenticationService } from '../../services/authentication.service';
import { TUser } from '../../data/person';
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

@Component({
  selector: 'app-modal-detail-event',
  templateUrl: './modal-detail-event.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './modal-detail-event.component.css',
})
export class ModalDetailEventComponent {
  readonly dialogRef = inject(MatDialogRef<ModalDetailEventComponent>);
  readonly eventID = inject<string>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

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
  user?: TUser | null;

  constructor(
    private eventsService: EventsService,
    private authenticationService: AuthenticationService,
    private toastService: ToastService
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
    const dialogRef = this.dialog.open(ModalFeedbackComponent, {
      height: '25%',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
    console.log('Comment');
  }

  onDelete() {
    this.toastService.showToastWithConfirm('delete', () => {
      this.dialogRef.close();
    });
    console.log('Delete');
  }

  onEdit() {
    if (!this.data.event) return;
    const dialogRef = this.dialog.open(ModalAddEventComponent, {
      height: '80%',
      width: '600px',
      data: this.data.event?.idEvent,
    });
    dialogRef.afterClosed().subscribe((result) => {});
    console.log('Edit');
  }
}
