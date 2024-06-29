import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TEvent, TTypeEvent } from '../data/event';
import { EventsService } from '../services/events.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { TCreateTypeLocation, TLocationType } from '../data/location';

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
    eventsService.reloadEvents();
    eventsService.events$.subscribe((events) => {
      this.events = events;
    });
  }

  onFilter() {
    this.eventsService
      .filterEvents({
        cities: this.selectedCities,
        eventTypes: this.selectedEventTypes,
        locationTypes: this.selectedLocationTypes.map(
          (selectedLocationType) =>
            selectedLocationType.toUpperCase() as TCreateTypeLocation
        ),
        startDate: this.selectedDateRange.start!,
        endDate: this.selectedDateRange.end!,
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
    console.log('Data filter: ', {
      selectedCities: this.selectedCities,
      selectedEventTypes: this.selectedEventTypes,
      selectedLocationTypes: this.selectedLocationTypes,
      selectedDateRange: this.selectedDateRange,
      orderBy: this.orderByCriteria.value,
      likeTitle: this.searchForm.controls['searchInput'].value,
    });
  }
}
