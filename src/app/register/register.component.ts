import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private fb: FormBuilder, private router: Router) {}

  form = this.fb.group({
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

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.router.navigate(['/my-events']);
    }
  }

  onFocus(input: HTMLElement) {
    const formControlName = input.getAttribute('formControlName') as
      | 'email'
      | 'password'
      | 'confirmPassword'
      | null;
    if (formControlName) this.form.controls[formControlName].markAsUntouched();
  }

  validatePassword(): ValidatorFn {
    return (controls) => {
      if (!controls.parent) return null;
      const parent = controls.parent as FormGroup<{
        email: FormControl<string | null>;
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
