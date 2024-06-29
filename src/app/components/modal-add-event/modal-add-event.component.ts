import { Component, OnInit, inject, signal } from '@angular/core';
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
  TCreateTypeLocation,
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

function toISOStringWithTimeZoneOffset(date: Date) {
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
}

function formatTime(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();

  return `${hours < 10 ? '0' + hours : hours}:${
    minutes < 10 ? '0' + minutes : minutes
  }`;
}

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
  placeholderCity = signal('');

  readonly dialogRef = inject(MatDialogRef<ModalAddEventComponent>);
  readonly data = inject<TEvent | undefined>(MAT_DIALOG_DATA);

  startDayForm = new FormGroup({
    date: new FormControl<Date | null>(this.data ? this.data.startTime : null),
  });
  endDayForm = new FormGroup({
    date: new FormControl<Date | null>(this.data ? this.data.endTime : null),
  });

  startTimeForm = new FormGroup({
    time: new FormControl<string | null>(
      this.data ? formatTime(this.data.startTime) : null
    ),
  });
  endTimeForm = new FormGroup({
    time: new FormControl<string | null>(
      this.data ? formatTime(this.data.endTime) : null
    ),
  });

  locationTypeControl = new FormControl<TLocationType>(
    this.data ? this.data.typeLocationName : locationTypes[0]
  );

  cityForm = this.fb.group({
    cityGroup: this.data ? this.data.location?.name : '',
  });

  selectedEventType = signal<TTypeEvent>(
    this.data ? this.data.typeEvent.name : 'Conference'
  );

  form = this.fb.group({
    title: [
      this.data ? this.data.title : '',
      {
        validators: [Validators.required],
      },
    ],
    description: [
      this.data ? this.data.description : '',
      {
        validators: [Validators.required, Validators.maxLength(2500)],
      },
    ],
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
    console.log('Initial data to edit:', { data: this.data });
    this.checkLocationType(this.locationTypeControl.value!);
    locationService.getAll().subscribe((data) => {
      this.cityGroups = data;
    });
    eventTypeService.getAll().subscribe((data) => {
      this.eventTypesList = data.map((data) => data.name);
    });
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  checkLocationType(value: string) {
    const ctrl = this.cityForm.controls['cityGroup'];
    ctrl.disable();
    if (value !== 'Online') {
      ctrl.enable();
    } else {
      ctrl.disable();
    }
  }

  selectedImage: undefined | File;

  isStartDayError = false;
  isEndDayError = false;
  isStartTimeError = false;
  isEndTimeError = false;
  isEventTypesError = false;
  isCitiesError = false;
  isLocationTypesError = false;

  daysError = signal('');
  timeError = signal('');
  errorImage = signal('');
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
    this.daysError.set('');
    this.timeError.set('');
    if (!this.startDayForm.value.date || !this.endDayForm.value.date) return;
    if (
      combineDateAndTime(
        this.startDayForm.value.date,
        this.startTimeForm.value.time!
      ).getTime() < new Date().getTime() ||
      combineDateAndTime(
        this.endDayForm.value.date,
        this.endTimeForm.value.time!
      ).getTime() < new Date().getTime()
    ) {
      this.daysError.set(
        'Day invalid (Start day/time and end day/time must be after current moment)'
      );
      return;
    }
    if (
      this.startDayForm.value.date.getTime() >
      this.endDayForm.value.date.getTime()
    ) {
      this.daysError.set('Day invalid (Start day must be before end day)');
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
          this.timeError.set(
            'Time invalid (With start day the same as end day, start time must be before end time)'
          );
        }
      }
    }
  }

  onFocus(input: HTMLElement) {
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

    let urlImage = undefined;

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
    }

    if (this.data) {
      this.eventService
        .editEvent(this.data.idEvent, {
          title: title!,
          description: description!,
          startTime: toISOStringWithTimeZoneOffset(
            combineDateAndTime(startDay, startTime)
          ),
          endTime: toISOStringWithTimeZoneOffset(
            combineDateAndTime(endDay, endTime)
          ),
          typeEventName: eventType()!,
          locationName: locationType !== 'Online' ? city! : undefined,
          typeLocation: locationType!.toUpperCase() as TCreateTypeLocation,
          image: this.data.image,
          organizer: this.user!,
        })
        .subscribe({
          next: () => {
            this.toastService.showToast({
              icon: 'success',
              title: 'Event updated successfully!',
            });
          },
          error: (error) => {
            this.toastService.showToast({ icon: 'error' });
          },
        });
    } else {
      this.eventService
        .createEvent({
          title: title!,
          description: description!,
          startTime: toISOStringWithTimeZoneOffset(
            combineDateAndTime(startDay, startTime)
          ),
          endTime: toISOStringWithTimeZoneOffset(
            combineDateAndTime(endDay, endTime)
          ),
          typeEventName: eventType()!,
          locationName: locationType !== 'Online' ? city! : undefined,
          typeLocation: locationType!.toUpperCase() as TCreateTypeLocation,
          image: urlImage,
          organizer: this.user!,
        })
        .subscribe({
          next: () => {
            this.toastService.showToast({
              icon: 'success',
              title: 'Event created successfully!',
            });
          },
          error: (error) => {
            this.toastService.showToast({
              icon: 'error',
            });
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
      this.daysError() !== '' ||
      this.timeError() !== ''
    );
  }

  get title() {
    return this.form.controls['title'];
  }

  get description() {
    return this.form.controls['description'];
  }
}
