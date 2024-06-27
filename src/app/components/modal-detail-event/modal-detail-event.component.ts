import { Component, inject, signal } from '@angular/core';
import { TEvent } from '../../data/event';
import { EventsService } from '../../services/events.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import { ModalService } from '../../services/modal.service';
import { ParticipationService } from '../../services/participation.service';

@Component({
  selector: 'app-modal-detail-event',
  templateUrl: './modal-detail-event.component.html',
  styleUrl: './modal-detail-event.component.css',
})
export class ModalDetailEventComponent {
  readonly dialogRef = inject(MatDialogRef<ModalDetailEventComponent>);
  readonly eventID = inject<string>(MAT_DIALOG_DATA);
  isError = signal(false);

  onNoClick(): void {
    this.dialogRef.close();
  }
  event?: TEvent;
  user?: TUser;

  constructor(
    private eventsService: EventsService,
    private participationService: ParticipationService,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private modalService: ModalService
  ) {
    authenticationService.user.subscribe((person) => {
      this.user = person;
    });
    eventsService.getEvent(this.eventID).subscribe({
      next: (event) => {
        console.log(event);
        this.event = event;
      },
      error: (error) => {
        console.error(error);
        this.isError.set(true);
      },
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
    this.toastService.showToastWithConfirm('cancel', () => {
      this.participationService.cancelEvent(this.eventID).subscribe({
        next: () => {
          this.eventsService.getEvent(this.eventID);
          this.eventsService.getMyEvents();
        },
        error: (error) => {
          this.toastService.showToast('error', error);
        },
      });
    });
  }

  onParticipate() {
    this.participationService.participateEvent(this.eventID).subscribe({
      next: () => {
        this.toastService.showToast('success', 'Participate');
        this.eventsService.getEvent(this.eventID);
        this.eventsService.getMyEvents();
      },
      error: (error) => {
        this.toastService.showToast('error', error);
      },
    });
  }

  onComment() {
    this.modalService.openModalFeedback(this.eventID);
  }

  onDelete() {
    this.toastService.showToastWithConfirm('delete', () => {
      this.eventsService.deleteEvent(this.eventID).subscribe({
        next: () => {
          this.eventsService.getAll();
          this.eventsService.getMyEvents();
          this.dialogRef.close();
        },
        error: (error) => {
          this.toastService.showToast('error', error);
        },
      });
    });
  }

  onEdit() {
    if (!this.event) return;
    this.modalService.openModalAddEvent(this.event.idEvent);
    this.eventsService.getEvent(this.eventID);
    this.eventsService.getAll();
    this.eventsService.getMyEvents();
  }
}
