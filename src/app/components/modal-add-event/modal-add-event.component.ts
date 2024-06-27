import {
  Component,
  OnInit,
  inject,
  input,
  isDevMode,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TEvent, TTypeEvent } from '../../data/event';
import {
  SupabaseService,
  supabaseUrlPublic,
} from '../../services/supabase.service';
import { Observable, map, startWith } from 'rxjs';
import {
  TCityGroup,
  TLocationType,
  _filterGroup,
  locationTypes,
} from '../../data/location';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { AuthenticationService } from '../../services/authentication.service';
import { TUser } from '../../data/person';
import { ToastService } from '../../services/toast.service';
import { EventsService } from '../../services/events.service';
import { LocationService } from '../../services/location.service';
import { EventTypeService } from '../../services/event-type.service';

function combineDateAndTime(dateObj: Date, timeStr: string) {
  // Extract year, month, and day from the date object
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth(); // Note: Months are zero-based (0-11)
  const day = dateObj.getDate();

  // Extract hours and minutes from the time string
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Create a new Date object with the combined date and time
  const combinedDate = new Date(year, month, day, hours, minutes);

  return combinedDate;
}

function getTimeAsNumberOfMinutes(time: string) {
  const timeParts = time.split(':');

  const timeInMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);

  return timeInMinutes;
}
@Component({
  selector: 'app-modal-add-event',
  templateUrl: './modal-add-event.component.html',
  styleUrl: './modal-add-event.component.css',
})
export class ModalAddEventComponent implements OnInit {
  eventTypesList: TTypeEvent[] = [];
  locationTypes = locationTypes;
  event: TEvent | undefined;
  placeholderCity = signal('');

  readonly dialogRef = inject(MatDialogRef<ModalAddEventComponent>);
  readonly data = inject<string | undefined>(MAT_DIALOG_DATA);

  startDayForm = new FormGroup({
    date: new FormControl<Date | null>(isDevMode() ? new Date() : null),
  });
  endDayForm = new FormGroup({
    date: new FormControl<Date | null>(isDevMode() ? new Date() : null),
  });

  startTimeForm = new FormGroup({
    time: new FormControl<string | null>(null),
  });
  endTimeForm = new FormGroup({
    time: new FormControl<string | null>(null),
  });
  user?: TUser | null;

  cityGroups: TCityGroup[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly supabase: SupabaseService,
    private authenticationService: AuthenticationService,
    private eventService: EventsService,
    private toastService: ToastService,
    private locationService: LocationService,
    private eventTypeService: EventTypeService
  ) {
    locationService.getAll().subscribe((data) => {
      this.cityGroups = data;
    });
    eventTypeService.getAll().subscribe((data) => {
      this.eventTypesList = data;
    });
    this.authenticationService.user.subscribe((x) => (this.user = x));
    if (this.data) {
      eventService.getEvent(this.data).subscribe((event) => {
        if (!event) {
          console.error('Event not found');
          return;
        }
        this.form.controls['title'].setValue(event.title);
        this.form.controls['description'].setValue(event.description);
        this.startDayForm.controls['date'].setValue(new Date(event.startTime));
        this.endDayForm.controls['date'].setValue(new Date(event.endTime));
        this.startTimeForm.controls['time'].setValue(
          event.startTime.toLocaleTimeString().slice(0, 5)
        );
        this.endTimeForm.controls['time'].setValue(
          event.endTime.toLocaleTimeString().slice(0, 5)
        );
        this.selectedEventType = event.typeEvent.name;
        this.cityForm.controls['cityGroup'].setValue(
          event.location?.name || ''
        );
        this.locationTypeControl.setValue(event.typeLocationName);
        this.event = event;
        return;
      });
    }
  }

  checkLocationType(event: MatButtonToggleChange) {
    const value = event.value;
    const ctrl = this.cityForm.controls['cityGroup'];

    if (event.value !== 'ONLINE') {
      ctrl.enable();
    } else {
      ctrl.disable();
      ctrl.setValue(null);
    }
  }

  selectedEventType: undefined | TTypeEvent;
  selectedImage: undefined | File;

  isStartDayError = false;
  isEndDayError = false;
  isStartTimeError = false;
  isEndTimeError = false;
  isEventTypesError = false;
  isCitiesError = false;
  isLocationTypesError = false;

  isDaysError = signal(false);
  isTimeError = signal(false);
  errorImage = signal('');

  locationTypeControl = new FormControl<TLocationType | undefined>(
    isDevMode() ? 'ONSITE' : undefined
  );

  cityForm = this.fb.group({
    cityGroup: '',
  });
  citiesGroupOptions: Observable<TCityGroup[]> | undefined;

  ngOnInit() {
    this.citiesGroupOptions = this.cityForm.get('cityGroup')!.valueChanges.pipe(
      startWith(''),
      map((value) => _filterGroup(this.cityGroups, value || ''))
    );
  }

  onCancel() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private computeErrors(): void {
    this.isDaysError.set(false);
    this.isTimeError.set(false);
    if (!this.startDayForm.value.date || !this.endDayForm.value.date) return;
    if (
      this.startDayForm.value.date.getTime() >
      this.endDayForm.value.date.getTime()
    ) {
      this.isDaysError.set(true);
    } else {
      if (
        this.startDayForm.value.date.getTime() ==
        this.endDayForm.value.date.getTime()
      ) {
        if (!this.startTimeForm.value.time || !this.endTimeForm.value.time)
          return;
        if (
          getTimeAsNumberOfMinutes(this.startTimeForm.value.time) >
          getTimeAsNumberOfMinutes(this.endTimeForm.value.time)
        ) {
          this.isTimeError.set(true);
        }
      }
    }
  }

  errorAuthenticating = false;
  form = this.fb.group({
    title: [
      isDevMode() ? 'New Event' : '',
      {
        validators: [Validators.required],
      },
    ],
    description: [
      isDevMode()
        ? 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi earum optio iste aspernatur nobis accusantium nulla molestias, obcaecati, maiores nisi id esse recusandae quod? Itaque et facere similique perspiciatis qui!'
        : '',
      {
        validators: [Validators.required, Validators.maxLength(2500)],
      },
    ],
  });

  onFocus(input: HTMLElement) {
    this.errorAuthenticating = false;
    const formControlName = input.getAttribute('formControlName') as
      | 'title'
      | 'description'
      | null;
    if (formControlName) this.form.controls[formControlName].markAsUntouched();
  }

  async onSubmit() {
    this.errorImage.set('');
    this.form.markAllAsTouched();
    this.cityForm.markAllAsTouched();
    this.locationTypeControl.markAsTouched();
    this.startDayForm.markAllAsTouched();
    this.endDayForm.markAllAsTouched();
    this.startTimeForm.markAllAsTouched();
    this.endTimeForm.markAllAsTouched();
    this.computeErrors();

    const { title, description } = this.form.value;
    const startDay = this.startDayForm.value.date;
    const endDay = this.endDayForm.value.date;
    const startTime = this.startTimeForm.value.time;
    const endTime = this.endTimeForm.value.time;
    const eventType = this.selectedEventType;
    const city = this.cityForm.value.cityGroup;
    const locationType = this.locationTypeControl.value;
    const image = this.selectedImage;

    if (
      this.isFormInvalid() ||
      !startDay ||
      !endDay ||
      !startTime ||
      !endTime
    ) {
      return;
    }

    let urlImage = '';

    if (!isDevMode()) {
      if (image) {
        const { data: dataSupabase, error: errorSupabase } =
          await this.supabase.uploadImage('events', image);
        if (errorSupabase || dataSupabase === null) {
          if (errorSupabase?.message === 'The resource already exists') {
            this.errorImage.set(
              'The resource already exists. Please choose another image or change its name.'
            );
          } else {
            this.errorImage.set(
              'There was an error uploading the image. Please try again.'
            );
          }
          return;
        }
        urlImage = supabaseUrlPublic + dataSupabase.fullPath;
      } else {
        urlImage =
          'https://lmapqwxheetscsdyjvsi.supabase.co/storage/v1/object/public/Images/Default_avatar_profile.jpg';
      }
    }

    urlImage =
      urlImage !== ''
        ? urlImage
        : 'https://lmapqwxheetscsdyjvsi.supabase.co/storage/v1/object/public/Images/events/event1.jpg';

    if (this.data) {
      this.eventService
        .editEvent(this.event?.idEvent!, {
          title: title!,
          description: description!,
          startTime: combineDateAndTime(startDay, startTime),
          endTime: combineDateAndTime(endDay, endTime),
          typeEventName: eventType!,
          locationName: city!,
          typeLocation: locationType!,
          image:
            this.event?.image ||
            'https://lmapqwxheetscsdyjvsi.supabase.co/storage/v1/object/public/Images/Default_avatar_profile.jpg',
          organizer: this.user!,
        })
        .subscribe({
          next: () => {
            this.eventService.getMyEvents();
            this.toastService.showToast(
              'success',
              'Event updated successfully!'
            );
          },
          error: (error) => {
            this.toastService.showToast(
              'error',
              error + '. Please try again later'
            );
          },
        });
    } else {
      this.eventService
        .createEvent({
          title: title!,
          description: description!,
          startTime: combineDateAndTime(startDay, startTime),
          endTime: combineDateAndTime(endDay, endTime),
          typeEventName: eventType!,
          locationName: city!,
          typeLocation: locationType!,
          image: urlImage,
          organizer: this.user!,
        })
        .subscribe({
          next: () => {
            this.eventService.getMyEvents();
            this.toastService.showToast(
              'success',
              'Event created successfully!'
            );
          },
          error: (error) => {
            this.toastService.showToast(
              'error',
              error + '. Please try again later'
            );
          },
        });
    }
    this.dialogRef.close();
  }

  isFormInvalid() {
    const startDayInvalid = this.startDayForm.invalid;

    const endDayInvalid = this.endDayForm.invalid;

    const startTimeInvalid = this.startTimeForm.invalid;

    const endTimeInvalid = this.endTimeForm.invalid;

    const cityInvalid = this.cityForm.invalid;

    const locationTypeInvalid = this.locationTypeControl.invalid;

    return (
      this.form.invalid ||
      startDayInvalid ||
      endDayInvalid ||
      startTimeInvalid ||
      endTimeInvalid ||
      !this.selectedEventType ||
      cityInvalid ||
      locationTypeInvalid ||
      this.isDaysError() ||
      this.isTimeError()
    );
  }

  get title() {
    return this.form.controls['title'];
  }

  get description() {
    return this.form.controls['description'];
  }
}
