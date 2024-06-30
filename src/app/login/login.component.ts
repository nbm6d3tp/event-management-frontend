import { Component, isDevMode, model } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }
  errorAuthenticating = false;
  form = this.fb.group({
    email: [
      isDevMode() ? 'user1@gmail.com' : '',
      {
        validators: [Validators.required, Validators.email],
      },
    ],

    password: [
      isDevMode() ? '12345678' : '',
      {
        validators: [Validators.required, Validators.minLength(8)],
      },
    ],
  });

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
