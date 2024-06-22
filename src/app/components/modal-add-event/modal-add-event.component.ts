import { Component, inject, isDevMode } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TTypeEvent } from '../../data/event';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from '../../data/supabase';

// toFormData(this.signup.value);

function toFormData<T extends { [key: string]: any }>(formValue: T) {
  const formData = new FormData();

  for (const key of Object.keys(formValue)) {
    const value = formValue[key];
    formData.append(key, value);
  }

  return formData;
}

function requiredFileType(types: string[]) {
  return function (control: FormControl) {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (
        !types
          .map((type) => type.toLowerCase())
          .includes(extension.toLowerCase())
      ) {
        return {
          requiredFileType: true,
        };
      }
      return null;
    }
    return null;
  };
}

@Component({
  selector: 'app-modal-add-event',
  templateUrl: './modal-add-event.component.html',
  styleUrl: './modal-add-event.component.css',
})
export class ModalAddEventComponent {
  readonly dialogRef = inject(MatDialogRef<ModalAddEventComponent>);
  selectedStartDay = new Date();
  selectedEndDay = new Date();
  selectedStartHour = new Date();
  selectedEndHour = new Date();
  selectedEventTypes: TTypeEvent[] = [];
  selectedCities: string[] = [];
  selectedLocationTypes: string[] = [];
  private supabase: SupabaseClient;

  onNoClick(): void {
    this.dialogRef.close();
  }

  constructor(private fb: FormBuilder) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
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
    image: [
      null,
      {
        validators: [
          Validators.required,
          requiredFileType(['png', 'jpeg', 'jpg']),
        ],
      },
    ],
  });

  onFocus(input: HTMLElement) {
    this.errorAuthenticating = false;
    const formControlName = input.getAttribute('formControlName') as
      | 'title'
      | 'description'
      | 'image'
      | null;
    if (formControlName) this.form.controls[formControlName].markAsUntouched();
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    const avatarFile = '';
    const { data, error } = await this.supabase.storage
      .from('Images')
      .upload('avatars/avatar1.png', avatarFile);
    // if (this.form.valid && this.email.value && this.password.value) {
    //   this.authenticationService
    //     .login(this.email.value, this.password.value)
    //     .pipe(first())
    //     .subscribe({
    //       next: () => {
    //         // get return url from route parameters or default to '/'
    //         const returnUrl =
    //           this.route.snapshot.queryParams['returnUrl'] || '/';
    //         console.log({ returnUrl });
    //         this.router.navigate([returnUrl]);
    //       },
    //       error: () => {
    //         this.errorAuthenticating = true;
    //       },
    //     });
    //   // this.router.navigate(['/my-events']);
    // }
  }

  get title() {
    return this.form.controls['title'];
  }

  get description() {
    return this.form.controls['description'];
  }

  get image() {
    return this.form.controls['image'];
  }
}
