import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TEvent } from '../data/event';
import { EventsService } from '../services/events.service';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllEventsComponent {
  events: TEvent[] = [];

  selectedCities: string[] = [];
  selectedEventTypes: string[] = [];
  selectedLocationTypes: string[] = [];
  selectedDateRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null,
  };

  searchForm = this.fb.group({
    searchInput: [''],
  });

  orderByCriteria = new FormControl('');

  constructor(private eventsService: EventsService, private fb: FormBuilder) {
    eventsService.getAll().subscribe((events) => {
      this.events = events;
    });
  }

  onFilter() {
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
