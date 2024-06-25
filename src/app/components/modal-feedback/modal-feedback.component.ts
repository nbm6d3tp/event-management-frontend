import { Component, inject, isDevMode, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TPerson } from '../../data/person';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-modal-feedback',
  templateUrl: './modal-feedback.component.html',
  styleUrl: './modal-feedback.component.css',
})
export class ModalFeedbackComponent {
  user?: TPerson | null;
  rating = signal(0);

  readonly dialogRef = inject(MatDialogRef<ModalFeedbackComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log('Data submit: ', {
      person: this.user,
      content: this.comment.value,
      rating: this.rating(),
    });
    this.dialogRef.close();
    this.toastService.showToast('success', 'Comment');
  }

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private toastService: ToastService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  form = this.fb.group({
    comment: [
      isDevMode()
        ? 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi earum optio iste aspernatur nobis accusantium nulla molestias, obcaecati, maiores nisi id esse recusandae quod? Itaque et facere similique perspiciatis qui!'
        : '',
      {
        validators: [Validators.required, Validators.maxLength(2500)],
      },
    ],
  });
  get comment() {
    return this.form.controls['comment'];
  }
}
