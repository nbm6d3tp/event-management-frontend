import { Component, inject, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TUser } from '../../data/person';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { FeedbackService } from '../../services/feedback.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-modal-feedback',
  templateUrl: './modal-feedback.component.html',
  styleUrl: './modal-feedback.component.css',
})
export class ModalFeedbackComponent {
  user?: TUser;
  rating = signal(0);
  readonly data = inject<string>(MAT_DIALOG_DATA);

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private eventsService: EventsService,
    private feedbackService: FeedbackService,
    private toastService: ToastService
  ) {
    console.log(this.data);
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  readonly dialogRef = inject(MatDialogRef<ModalFeedbackComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (!this.data) return;
    this.feedbackService
      .createFeedback({
        idEvent: this.data,
        content: this.comment.value!,
        score: this.rating(),
      })
      .subscribe({
        next: () => {
          this.toastService.showToast({
            icon: 'success',
            title: 'Feedback sent!',
          });
        },
        error: (error) => {
          console.error(error);
          this.toastService.showToast({
            icon: 'error',
          });
        },
      });
    this.dialogRef.close();
  }

  form = this.fb.group({
    comment: [
      '',
      {
        validators: [Validators.maxLength(2500)],
      },
    ],
  });
  get comment() {
    return this.form.controls['comment'];
  }
}
