import { Component } from '@angular/core';
import { TPerson } from '../data/person';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent {
  user?: TPerson | null;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  onClickLogout() {
    this.authenticationService.logout();
  }
}
