import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { TEvent, TTypeEvent } from '../data/event';
import { TCreateTypeLocation, TLocationType } from '../data/location';
import { toISOStringWithTimeZoneOffset } from '../helpers/dateTime';
import { hasData } from '../helpers/utils';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css',
})
export class AllEventsComponent {
  events: TEvent[] = [];

  selectedCities: string[] = [];
  selectedEventTypes = signal<TTypeEvent[]>([]);
  selectedLocationTypes: TLocationType[] = [];
  selectedDateRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null,
  };
  orderByCriteria = new FormControl('');

  constructor(private eventsService: EventsService, private fb: FormBuilder) {
    eventsService.reloadEvents();
    eventsService.events$.subscribe((events) => {
      this.events = events;
    });
  }

  haveResetButton() {
    return (
      hasData(this.selectedCities) ||
      hasData(this.selectedEventTypes()) ||
      hasData(this.selectedLocationTypes) ||
      hasData(this.selectedDateRange.start?.toString()) ||
      hasData(this.selectedDateRange.end?.toString()) ||
      hasData(this.orderByCriteria.value)
    );
  }

  onReset() {
    this.selectedCities = [];
    this.selectedEventTypes.set([]);
    this.selectedLocationTypes = [];
    this.selectedDateRange = {
      start: null,
      end: null,
    };
    this.orderByCriteria.setValue('');
  }

  onFilter() {
    console.log({
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
    });
    this.eventsService
      .filterEvents({
        cities: this.selectedCities,
        eventTypes: this.selectedEventTypes(),
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
