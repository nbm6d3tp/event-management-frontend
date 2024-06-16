import { Component, model } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private fb: FormBuilder, private router: Router) {}

  form = this.fb.group({
    email: [
      '',
      {
        validators: [Validators.required, Validators.email],
      },
    ],

    password: [
      '',
      {
        validators: [Validators.required, Validators.minLength(8)],
      },
    ],
  });

  onFocus(input: HTMLElement) {
    const formControlName = input.getAttribute('formControlName') as
      | 'email'
      | 'password'
      | null;
    if (formControlName) this.form.controls[formControlName].markAsUntouched();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.router.navigate(['/my-events']);
    }
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }
}
