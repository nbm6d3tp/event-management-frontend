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
import { BehaviorSubject } from 'rxjs';

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
  private eventSubject = new BehaviorSubject<TEvent | undefined>(undefined);
  event$ = this.eventSubject.asObservable();
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
    this.reloadEvent();
    this.event$.subscribe((event) => {
      this.event = event;
    });
  }

  public reloadEvent(): void {
    this.eventsService.getEvent(this.eventID).subscribe({
      next: (event) => {
        this.eventSubject.next(event);
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
          this.reloadEvent();
        },
        error: (error) => {
          console.log(error);
          this.toastService.showToast('error', error);
        },
      });
    });
  }

  onParticipate() {
    this.participationService.participateEvent(this.eventID).subscribe({
      next: () => {
        this.toastService.showToast('success', 'Participate');
        this.reloadEvent();
      },
      error: (error) => {
        this.toastService.showToast('error', error);
      },
    });
  }

  onComment() {
    this.modalService.openModalFeedback({
      idEvent: this.eventID,
      onSuccess: this.reloadEvent,
    });
  }

  onDelete() {
    this.toastService.showToastWithConfirm('delete', () => {
      this.eventsService.deleteEvent(this.eventID).subscribe({
        next: () => {
          this.reloadEvent();
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
    this.modalService.openModalAddEvent({
      event: this.event,
      onSuccess: () => {
        this.reloadEvent();
      },
    });
  }
}
