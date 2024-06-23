import { Component, OnInit, inject, isDevMode, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TTypeEvent, typeEventList } from '../../data/event';
import { SupabaseService } from '../../services/supabase.service';
import { Observable, map, startWith } from 'rxjs';
import { TCityGroup, cityGroups, locationTypes } from '../../data/location';

const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-modal-add-event',
  templateUrl: './modal-add-event.component.html',
  styleUrl: './modal-add-event.component.css',
})
export class ModalAddEventComponent implements OnInit {
  typeEventList = typeEventList;
  locationTypes = locationTypes;

  startDayForm = new FormGroup({
    date: new FormControl<Date | null>(null),
  });
  endDayForm = new FormGroup({
    date: new FormControl<Date | null>(null),
  });

  startTimeForm = new FormGroup({
    time: new FormControl<Date | null>(null),
  });
  endTimeForm = new FormGroup({
    time: new FormControl<Date | null>(null),
  });

  readonly dialogRef = inject(MatDialogRef<ModalAddEventComponent>);

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

  cityForm = this.fb.group({
    cityGroup: '',
  });
  citiesGroupOptions: Observable<TCityGroup[]> | undefined;

  locationTypeControl = new FormControl('');

  ngOnInit() {
    this.citiesGroupOptions = this.cityForm.get('cityGroup')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroup(value || ''))
    );
  }

  private _filterGroup(value: string): TCityGroup[] {
    if (value) {
      return cityGroups
        .map((group) => ({
          letter: group.letter,
          names: _filter(group.names, value),
        }))
        .filter((group) => group.names.length > 0);
    }
    return cityGroups;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private computeErrors(): void {
    if (!this.startDayForm.value.date || !this.endDayForm.value.date) return;
    if (this.startDayForm.value.date > this.endDayForm.value.date) {
      this.isDaysError.set(true);
      this.isTimeError.set(true);
    } else {
      this.isDaysError.set(false);
      if (
        this.startDayForm.value.date.getTime() ==
        this.endDayForm.value.date.getTime()
      ) {
        if (!this.startTimeForm.value.time || !this.endTimeForm.value.time)
          return;
        if (this.startTimeForm.value.time > this.endTimeForm.value.time) {
          this.isTimeError.set(true);
        } else {
          this.isTimeError.set(false);
        }
      } else {
        this.isTimeError.set(false);
      }
    }
  }

  constructor(
    private fb: FormBuilder,
    private readonly supabase: SupabaseService
  ) {}

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
    this.form.markAllAsTouched();
    this.cityForm.markAllAsTouched();
    this.locationTypeControl.markAsTouched();
    this.startDayForm.markAllAsTouched();
    this.endDayForm.markAllAsTouched();
    this.startTimeForm.markAllAsTouched();
    this.endTimeForm.markAllAsTouched();

    console.log('Title and description: ', this.form.value);
    console.log('Start day: ', this.startDayForm.value.date);
    console.log('End day: ', this.endDayForm.value.date);

    console.log('Start hour: ', this.startTimeForm.value.time);
    console.log('End hour: ', this.endTimeForm.value.time);

    console.log('Event types: ', this.selectedEventType);
    console.log('Cities: ', this.cityForm.value.cityGroup);
    console.log('Location types: ', this.locationTypeControl.value);
    console.log('Image: ', this.selectedImage);
    this.computeErrors();
    console.log('Errors: ', this.isDaysError(), this.isTimeError());

    const avatarFile: File = new File([''], 'avatar1.png', {
      type: 'image/png',
    });
    const { data, error } = await this.supabase.uploadImage(
      avatarFile,
      'avatars/avatar1.png'
    );

    // if (this.form.valid && this.email.value && this.password.value) {
    //   this.authenticationService
    //     .login(this.email.value, this.password.value)
    //     .pipe(first())
    //     .subscribe({
    //       next: () => {
    //         // get return url from route parameters or default to '/'
    //         const returnUrl =
    //           this.route.snapshot.queryParams['returnUrl'] || '/';
    //         console.log({ returnUrl });
    //         this.router.navigate([returnUrl]);
    //       },
    //       error: () => {
    //         this.errorAuthenticating = true;
    //       },
    //     });
    //   // this.router.navigate(['/my-events']);
    // }
  }

  get title() {
    return this.form.controls['title'];
  }

  get description() {
    return this.form.controls['description'];
  }
}
