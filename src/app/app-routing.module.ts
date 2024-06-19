import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyEventsComponent } from './my-events/my-events.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './helpers/auth.guard';
import { MyProfileComponent } from './my-profile/my-profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'my-events', pathMatch: 'full' },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'my-events',
        component: MyEventsComponent,
      },
      {
        path: 'all-events',
        component: AllEventsComponent,
      },
      { path: 'my-profile', component: MyProfileComponent },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
