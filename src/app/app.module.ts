import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { RegisterComponent } from './register/register.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { ModalDetailEventComponent } from './components/modal-detail-event/modal-detail-event.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CardEventComponent } from './components/card-event/card-event.component';
import { TruncateNamePipe } from './pipes/truncate-name.pipe';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NgOptimizedImage, provideImgixLoader } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MyEventsComponent,
    AllEventsComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    SpinnerComponent,
    ModalDetailEventComponent,
    MyProfileComponent,
    CardEventComponent,
    TruncateNamePipe,
  ],
  imports: [
    NgOptimizedImage,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    provideImgixLoader('https://placehold.co/600x400'),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
