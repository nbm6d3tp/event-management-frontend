import { Component, inject, isDevMode } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TCityGroup } from '../../data/location';
import { TTypeEvent } from '../../data/event';
import { TCity } from '../../data/city';

@Component({
  selector: 'app-modal-add-event',
  templateUrl: './modal-add-event.component.html',
  styleUrl: './modal-add-event.component.css',
})
export class ModalAddEventComponent {
  readonly dialogRef = inject(MatDialogRef<ModalAddEventComponent>);
  startDay = new Date();
  endDay = new Date();
  startHour = new Date();
  endHour = new Date();

  cityGroupOptions: Observable<TCityGroup[]> | undefined;

  typeEventList: TTypeEvent[] = ['Meetups', 'Conferences', 'Workshops'];
  typeEvents = new FormControl('');

  location: TCity | undefined;

  onNoClick(): void {
    this.dialogRef.close();
  }

  constructor(private fb: FormBuilder) {}
  errorAuthenticating = false;
  form = this.fb.group({
    title: [
      isDevMode() ? 'New Event' : '',
      {
        validators: [Validators.required],
      },
    ],
    description: [
      isDevMode()
        ? 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi earum optio iste aspernatur nobis accusantium nulla molestias, obcaecati, maiores nisi id esse recusandae quod? Itaque et facere similique perspiciatis qui!'
        : '',
      {
        validators: [Validators.required, Validators.maxLength(2500)],
      },
    ],
    password: [
      isDevMode() ? '12345678' : '',
      {
        validators: [Validators.required, Validators.minLength(8)],
      },
    ],
  });

  // onFocus(input: HTMLElement) {
  //   this.errorAuthenticating = false;
  //   const formControlName = input.getAttribute('formControlName') as
  //     | 'email'
  //     | 'password'
  //     | null;
  //   if (formControlName) this.form.controls[formControlName].markAsUntouched();
  // }

  // onSubmit() {
  //   this.form.markAllAsTouched();
  //   if (this.form.valid && this.email.value && this.password.value) {
  //     this.authenticationService
  //       .login(this.email.value, this.password.value)
  //       .pipe(first())
  //       .subscribe({
  //         next: () => {
  //           // get return url from route parameters or default to '/'
  //           const returnUrl =
  //             this.route.snapshot.queryParams['returnUrl'] || '/';
  //           console.log({ returnUrl });
  //           this.router.navigate([returnUrl]);
  //         },
  //         error: () => {
  //           this.errorAuthenticating = true;
  //         },
  //       });
  //     // this.router.navigate(['/my-events']);
  //   }
  // }

  // get email() {
  //   return this.form.controls['email'];
  // }

  // get password() {
  //   return this.form.controls['password'];
  // }
}
