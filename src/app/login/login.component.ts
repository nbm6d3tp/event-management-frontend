import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  errorAuthenticating = false;
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }

  onFocus(input: HTMLElement) {
    this.errorAuthenticating = false;
    const formControlName = input.getAttribute('formControlName') as
      | 'email'
      | 'password'
      | null;
    if (formControlName) this.form.controls[formControlName].markAsUntouched();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid && this.email.value && this.password.value) {
      this.authenticationService
        .login({
          email: this.email.value,
          password: this.password.value,
        })
        .pipe(first())
        .subscribe({
          next: () => {
            // get return url from route parameters or default to '/'
            const returnUrl =
              this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate([returnUrl]);
          },
          error: () => {
            this.errorAuthenticating = true;
          },
        });
      // this.router.navigate(['/my-events']);
    }
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }
}
