import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { toISOStringWithTimeZoneOffset } from '../components/modal-add-event/modal-add-event.component';
import { TEvent, TTypeEvent } from '../data/event';
import { TCreateTypeLocation, TLocationType } from '../data/location';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css',
})
export class AllEventsComponent {
  events: TEvent[] = [];

  selectedCities: string[] = [];
  selectedEventTypes: TTypeEvent[] = [];
  selectedLocationTypes: TLocationType[] = [];
  selectedDateRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null,
  };

  searchForm = this.fb.group({
    searchInput: [''],
  });

  orderByCriteria = new FormControl('');

  constructor(private eventsService: EventsService, private fb: FormBuilder) {
    eventsService.events$.subscribe((events) => {
      this.events = events;
    });
  }

  onFilter() {
    console.log('Data filter: ', {
      cities: this.selectedCities,
      eventTypes: this.selectedEventTypes,
      locationTypes: this.selectedLocationTypes.map(
        (selectedLocationType) =>
          selectedLocationType.toUpperCase() as TCreateTypeLocation
      ),
      startDate: this.selectedDateRange.start!,
      endDate: this.selectedDateRange.end!,
      orderBy: this.orderByCriteria.value!,
    });
    this.eventsService
      .filterEvents({
        cities: this.selectedCities,
        eventTypes: this.selectedEventTypes,
        locationTypes: this.selectedLocationTypes.map(
          (selectedLocationType) =>
            selectedLocationType.toUpperCase() as TCreateTypeLocation
        ),
        startDate: this.selectedDateRange.start
          ? toISOStringWithTimeZoneOffset(this.selectedDateRange.start)
          : undefined,
        endDate: this.selectedDateRange.end
          ? toISOStringWithTimeZoneOffset(this.selectedDateRange.end)
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
