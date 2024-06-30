import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { TEvent, TTypeEvent } from '../../data/event';
import {
  TCityGroup,
  TCreateTypeLocation,
  TLocationType,
  _filterGroup,
  locationTypes,
} from '../../data/location';
import { TUser } from '../../data/person';
import {
  combineDateAndTime,
  formatTime,
  getTimeAsNumberOfMinutes,
  toISOStringWithTimeZoneOffset,
} from '../../helpers/dateTime';
import { AuthenticationService } from '../../services/authentication.service';
import { EventTypeService } from '../../services/event-type.service';
import { EventsService } from '../../services/events.service';
import { LocationService } from '../../services/location.service';
import {
  SupabaseService,
  supabaseUrlPublic,
} from '../../services/supabase.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-modal-add-event',
  templateUrl: './modal-add-event.component.html',
  styleUrl: './modal-add-event.component.css',
})
export class ModalAddEventComponent implements OnInit {
  eventTypesList: TTypeEvent[] = [];
  locationTypes = locationTypes;
  user?: TUser | null;
  placeholderCity = signal('');
  daysError = signal('');
  timeError = signal('');
  errorImage = signal('');
  cityGroups: TCityGroup[] = [];
  citiesGroupOptions: Observable<TCityGroup[]> | undefined;

  readonly dialogRef = inject(MatDialogRef<ModalAddEventComponent>);
  readonly data = inject<TEvent | undefined>(MAT_DIALOG_DATA);

  selectedImage: undefined | File;
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

  constructor(
    private fb: FormBuilder,
    private readonly supabase: SupabaseService,
    private authenticationService: AuthenticationService,
    private eventService: EventsService,
    private toastService: ToastService,
    private locationService: LocationService,
    private eventTypeService: EventTypeService
  ) {
    this.checkLocationType(this.locationTypeControl.value!);
    this.locationService.locationsList$.subscribe((data) => {
      this.cityGroups = data;
    });
    this.eventTypeService.eventTypesList$.subscribe((data) => {
      this.eventTypesList = data;
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
        $localize`Day invalid (Start day/time and end day/time must be after current moment)`
      );
      return;
    }
    if (
      this.startDayForm.value.date.getTime() >
      this.endDayForm.value.date.getTime()
    ) {
      this.daysError.set(
        $localize`Day invalid (Start day must be before end day)`
      );
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
            $localize`Time invalid (With start day the same as end day, start time must be before end time)`
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
            $localize`The resource already exists. Please choose another image or change its name.`
          );
        } else {
          this.errorImage.set(
            $localize`There was an error uploading the image. Please try again.`
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
              title: $localize`Event updated successfully!`,
            });
          },
          error: () => {
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
              title: $localize`Event created successfully!`,
            });
          },
          error: () => {
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
