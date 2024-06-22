import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TEvent } from '../data/event';
import { EventsService } from '../services/events.service';
import { FormControl } from '@angular/forms';

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

  orderByCriteriaList: ('Date' | 'Note')[] = ['Date', 'Note'];
  orderByCriteria = new FormControl('');

  constructor(private eventsService: EventsService) {
    eventsService.getAll().subscribe((events) => {
      this.events = events;
    });
  }
}
