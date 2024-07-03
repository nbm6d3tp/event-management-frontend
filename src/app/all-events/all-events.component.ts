import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { TEvent, TTypeEvent } from '../data/event';
import {
  TCityGroup,
  TCreateTypeLocation,
  _filterGroup,
} from '../data/location';
import { toISOStringWithTimeZoneOffset } from '../helpers/dateTime';
import { hasData } from '../helpers/utils';
import { EventTypeService } from '../services/event-type.service';
import { EventsService } from '../services/events.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css',
})
export class AllEventsComponent implements OnInit {
  events: TEvent[] = [];
  typeEventList: TTypeEvent[] = [];
  selectedCities = signal<string[]>([]);
  cityGroups: TCityGroup[] = [];
  filteredData: Observable<TCityGroup[]> | undefined;
  placeholder = signal('Cities');
  hideMultipleSelectionIndicator = signal(false);

  locationTypesForm = new FormControl(['']);
  citiesForm = this.fb.group({
    cityGroup: '',
  });
  eventTypesForm = new FormControl<TTypeEvent[] | null>(null);
  dateRangeForm = this.fb.group({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  orderByCriteria = new FormControl('');

  constructor(
    private eventsService: EventsService,
    private eventTypeService: EventTypeService,
    private locationService: LocationService,
    private fb: FormBuilder
  ) {
    eventsService.reloadEvents();
    eventsService.events$.subscribe((events) => {
      this.events = events;
    });

    this.eventTypeService.eventTypesList$.subscribe((data) => {
      this.typeEventList = data;
    });
    this.locationService.locationsList$.subscribe((data) => {
      this.cityGroups = data;
    });
  }
  ngOnInit() {
    this.filteredData = this.citiesForm.get('cityGroup')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return _filterGroup(this.cityGroups, value || '');
      })
    );
  }

  toggleMultipleSelectionIndicator() {
    this.hideMultipleSelectionIndicator.update((value) => !value);
  }

  isOptionChecked(city: string) {
    return this.selectedCities()
      .map((selectedCity) => selectedCity)
      .includes(city);
  }

  optionClicked = (event: Event, data: string): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  toggleSelection = (data: string): void => {
    if (
      !this.selectedCities()
        .map((selectedCity) => selectedCity)
        .includes(data)
    ) {
      this.selectedCities.set([...this.selectedCities(), data]);
    } else {
      this.selectedCities.set(
        this.selectedCities().filter((city) => city !== data)
      );
    }
    this.placeholder.set(
      (this.selectedCities().map((selectedCity) => selectedCity) || []).join(
        ', '
      )
    );
  };

  haveResetButton() {
    return (
      hasData(this.selectedCities()) ||
      hasData(this.eventTypesForm.value) ||
      hasData(this.locationTypesForm.value) ||
      hasData(this.dateRangeForm.value.start?.toString()) ||
      hasData(this.dateRangeForm.value.end?.toString()) ||
      hasData(this.orderByCriteria.value)
    );
  }

  onReset() {
    this.selectedCities.set([]);
    this.citiesForm.setValue({ cityGroup: '' });
    this.eventTypesForm.setValue(null);
    this.locationTypesForm.setValue(null);
    this.dateRangeForm.setValue({
      start: null,
      end: null,
    });
    this.orderByCriteria.setValue('');
  }

  onFilter() {
    console.log({
      cities: this.selectedCities,
      eventTypes: this.eventTypesForm.value,
      locationTypes: this.locationTypesForm.value?.map(
        (selectedLocationType) =>
          selectedLocationType.toUpperCase() as TCreateTypeLocation
      ),
      startDate: this.dateRangeForm.value.start
        ? toISOStringWithTimeZoneOffset(this.dateRangeForm.value.start)
        : undefined,
      endDate: this.dateRangeForm.value.end
        ? toISOStringWithTimeZoneOffset(this.dateRangeForm.value.end)
        : undefined,
      orderBy: this.orderByCriteria.value!,
    });
    this.eventsService
      .filterEvents({
        cities: this.selectedCities(),
        eventTypes: this.eventTypesForm.value,
        locationTypes: this.locationTypesForm.value?.map(
          (selectedLocationType) =>
            selectedLocationType.toUpperCase() as TCreateTypeLocation
        ),
        startDate: this.dateRangeForm.value.start
          ? toISOStringWithTimeZoneOffset(this.dateRangeForm.value.start)
          : undefined,
        endDate: this.dateRangeForm.value.end
          ? toISOStringWithTimeZoneOffset(this.dateRangeForm.value.end)
          : undefined,
        orderBy: this.orderByCriteria.value!,
      })
      .subscribe({
        next: (data) => {
          this.events = data;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
