import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TUser } from '../../data/person';
import { AuthenticationService } from '../../services/authentication.service';
import { FeedbackService } from '../../services/feedback.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-modal-feedback',
  templateUrl: './modal-feedback.component.html',
  styleUrl: './modal-feedback.component.css',
})
export class ModalFeedbackComponent {
  user?: TUser;
  rating = signal(0);
  isError = signal(false);
  readonly data = inject<{ idEvent: string; onSuccess: () => void }>(
    MAT_DIALOG_DATA
  );
  readonly dialogRef = inject(MatDialogRef<ModalFeedbackComponent>);

  form = this.fb.group({
    comment: [
      '',
      {
        validators: [Validators.maxLength(2500)],
      },
    ],
  });

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private feedbackService: FeedbackService,
    private toastService: ToastService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.rating() < 1) this.isError.set(true);
    if (!this.data || this.isError()) return;
    this.feedbackService
      .createFeedback({
        idEvent: this.data.idEvent,
        content: this.comment.value!,
        score: this.rating(),
      })
      .subscribe({
        next: () => {
          this.toastService.showToast({
            icon: 'success',
            title: `Feedback sent!`,
          });
        },
        error: (error) => {
          console.error(error);
          this.toastService.showToast({
            icon: 'error',
          });
        },
        complete: () => {
          this.data.onSuccess();
        },
      });
    this.dialogRef.close();
  }

  get comment() {
    return this.form.controls['comment'];
  }
}
