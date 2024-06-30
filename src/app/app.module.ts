import {
  AsyncPipe,
  NgOptimizedImage,
  provideImgixLoader,
} from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { AllEventsComponent } from './all-events/all-events.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardEventComponent } from './components/card-event/card-event.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ModalAddEventComponent } from './components/modal-add-event/modal-add-event.component';
import { ModalDetailEventComponent } from './components/modal-detail-event/modal-detail-event.component';
import { ModalFeedbackComponent } from './components/modal-feedback/modal-feedback.component';
import { SelectCitiesComponent } from './components/select-cities/select-cities.component';
import { SelectDateRangeComponent } from './components/select-date-range/select-date-range.component';
import { SelectDateComponent } from './components/select-date/select-date.component';
import { SelectEventTypesComponent } from './components/select-event-types/select-event-types.component';
import { SelectLocationTypesComponent } from './components/select-location-types/select-location-types.component';
import { SelectTimeComponent } from './components/select-time/select-time.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { BasicAuthInterceptor } from './interceptors/auth.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { LoginComponent } from './login/login.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { GetNamePersonPipe } from './pipes/get-name-person.pipe';
import { TruncateNamePipe } from './pipes/truncate-name.pipe';
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from './services/authentication.service';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

function initializeApp(authService: AuthenticationService) {
  return (): void => authService.initialize();
}

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

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
    ModalAddEventComponent,
    SelectEventTypesComponent,
    SelectLocationTypesComponent,
    SelectDateRangeComponent,
    SelectCitiesComponent,
    FileUploadComponent,
    SelectTimeComponent,
    SelectDateComponent,
    StarRatingComponent,
    ModalFeedbackComponent,
    GetNamePersonPipe,
  ],
  imports: [
    FormsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSnackBarModule,
    NgxMatTimepickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatChipsModule,
    MatButtonToggleModule,
    MatSelectModule,
    NgOptimizedImage,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatRadioModule,
    HttpClientModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatDialogModule,
    MatButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthenticationService],
      multi: true,
    },
    provideImgixLoader('https://placehold.co/600x400'),
    provideNativeDateAdapter(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
