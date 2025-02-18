import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TEvent } from '../../data/event';
import { TUser } from '../../data/person';
import {
  canCancel,
  canComment,
  canDelete,
  canEdit,
  canParticipate,
} from '../../helpers/manageEvent';
import { AuthenticationService } from '../../services/authentication.service';
import { EventsService } from '../../services/events.service';
import { FeedbackService } from '../../services/feedback.service';
import { ModalService } from '../../services/modal.service';
import { ParticipationService } from '../../services/participation.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-modal-detail-event',
  templateUrl: './modal-detail-event.component.html',
  styleUrl: './modal-detail-event.component.css',
})
export class ModalDetailEventComponent {
  readonly dialogRef = inject(MatDialogRef<ModalDetailEventComponent>);
  readonly eventID = inject<string>(MAT_DIALOG_DATA);
  isError = signal(false);
  event?: TEvent;
  user?: TUser;

  canDelete = canDelete;
  canEdit = canEdit;
  canCancel = canCancel;
  canParticipate = canParticipate;
  canComment = canComment;

  constructor(
    private eventsService: EventsService,
    private participationService: ParticipationService,
    private authenticationService: AuthenticationService,
    private feedbackService: FeedbackService,
    private toastService: ToastService,
    private modalService: ModalService
  ) {
    this.authenticationService.user.subscribe((person) => {
      this.user = person;
    });
    this.eventsService.getEvent(this.eventID).subscribe({
      next: (event) => {
        this.event = event;
      },
      error: (error) => {
        console.error(error);
        this.isError.set(true);
      },
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

  onCancel() {
    this.toastService.showToastWithConfirm('cancel', () => {
      this.participationService.cancelEvent(this.eventID).subscribe({
        next: () => {
          this.toastService.showToast({
            icon: 'success',
            title: `Event canceled!`,
          });
        },
        error: (error) => {
          console.error(error);
          this.toastService.showToast({
            icon: 'error',
          });
        },
        complete: () => {
          this.dialogRef.close();
        },
      });
    });
  }

  onParticipate() {
    this.participationService.participateEvent(this.eventID).subscribe({
      next: () => {
        this.toastService.showToast({
          icon: 'success',
          title: `Event participated!`,
        });
      },
      error: (error) => {
        console.error(error);
        this.toastService.showToast({
          icon: 'error',
        });
      },
      complete: () => {
        this.dialogRef.close();
      },
    });
  }

  onComment() {
    this.modalService.openModalFeedback(this.eventID, () => {
      this.dialogRef.close();
    });
  }

  onDeleteFeedback() {
    this.toastService.showToastWithConfirm('delete', () => {
      this.feedbackService.deleteFeedback(this.eventID).subscribe({
        next: () => {
          this.toastService.showToast({
            icon: 'success',
            title: `Feedback deleted!`,
          });
        },
        error: (error) => {
          console.error(error);
          this.toastService.showToast({
            icon: 'error',
          });
        },
        complete: () => {
          this.dialogRef.close();
        },
      });
    });
  }

  onDelete() {
    this.toastService.showToastWithConfirm('delete', () => {
      this.eventsService.deleteEvent(this.eventID).subscribe({
        next: () => {
          this.toastService.showToast({
            icon: 'success',
            title: `Event deleted!`,
          });
        },
        error: (error) => {
          console.error(error);
          this.toastService.showToast({
            icon: 'error',
          });
        },
        complete: () => {
          this.dialogRef.close();
        },
      });
    });
  }

  onEdit() {
    if (!this.event) return;
    this.modalService.openModalAddEvent(this.event, () => {
      this.dialogRef.close();
    });
  }
}
