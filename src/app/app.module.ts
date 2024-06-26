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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalAddEventComponent } from './components/modal-add-event/modal-add-event.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectEventTypesComponent } from './components/select-event-types/select-event-types.component';
import { SelectLocationTypesComponent } from './components/select-location-types/select-location-types.component';
import { SelectDateRangeComponent } from './components/select-date-range/select-date-range.component';
import { SelectCitiesComponent } from './components/select-cities/select-cities.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SelectTimeComponent } from './components/select-time/select-time.component';
import { SelectDateComponent } from './components/select-date/select-date.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalFeedbackComponent } from './components/modal-feedback/modal-feedback.component';
import { MatBadgeModule } from '@angular/material/badge';
import { GetNamePersonPipe } from './pipes/get-name-person.pipe';

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
    provideNativeDateAdapter(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
