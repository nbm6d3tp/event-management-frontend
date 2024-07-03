import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import {
  SupabaseService,
  supabaseUrlPublic,
} from '../services/supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private readonly supabase: SupabaseService,
    private authenticationService: AuthenticationService
  ) {}
  selectedImage: undefined | File;
  errorImage = signal('');
  errorBdd = signal('');

  form = this.fb.group({
    firstName: ['', { validators: [Validators.required] }],
    lastName: ['', { validators: [Validators.required] }],
    email: ['', { validators: [Validators.required, Validators.email] }],
    password: [
      '',
      {
        validators: [Validators.required, Validators.minLength(8)],
      },
    ],
    confirmPassword: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(8),
          this.validatePassword(),
        ],
      },
    ],
  });

  async onSubmit() {
    this.errorImage.set('');
    this.errorBdd.set('');
    this.form.markAllAsTouched();

    if (
      this.form.valid &&
      this.email.value &&
      this.password.value &&
      this.firstName.value &&
      this.lastName.value
    ) {
      let urlImage = undefined;

      if (this.selectedImage) {
        const { data: dataSupabase, error: errorSupabase } =
          await this.supabase.uploadImage('events', this.selectedImage);
        if (errorSupabase || dataSupabase === null) {
          if (errorSupabase?.message === 'The resource already exists') {
            this.errorImage.set(
              `The resource already exists. Please choose another image or change its name.`
            );
          } else {
            this.errorImage.set(
              `There was an error uploading the image. Please try again.`
            );
          }
          return;
        } else {
          urlImage = supabaseUrlPublic + dataSupabase.fullPath;
        }
      }

      this.authenticationService
        .register({
          firstname: this.firstName.value,
          lastname: this.lastName.value,
          avatar: urlImage,
          email: this.email.value,
          password: this.password.value,
        })
        .subscribe({
          next: () => {
            this.router.navigate(['/my-events']);
          },
          error: (error) => {
            console.error(error);
            this.errorBdd.set('An user with this email has already existed');
          },
        });
    }
  }

  onFocus(input: HTMLElement) {
    this.errorImage.set('');
    this.errorBdd.set('');
    const formControlName = input.getAttribute('formControlName') as
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'password'
      | 'confirmPassword'
      | null;
    if (formControlName) this.form.controls[formControlName].markAsUntouched();
  }

  private validatePassword(): ValidatorFn {
    return (controls) => {
      if (!controls.parent) return null;
      const parent = controls.parent as FormGroup<{
        password: FormControl<string | null>;
        confirmPassword: FormControl<string | null>;
      }>;
      const password = parent.controls['password'];
      const confirmPassword = parent.controls['confirmPassword'];
      if (password === confirmPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  get firstName() {
    return this.form.controls['firstName'];
  }

  get lastName() {
    return this.form.controls['lastName'];
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

  get confirmPassword() {
    return this.form.controls['confirmPassword'];
  }
}
