import { Component } from '@angular/core';
import { TEvent } from '../data/event';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css',
})
export class AllEventsComponent {
  events: TEvent[] = [];

  constructor(private eventsService: EventsService) {
    eventsService.getAll().subscribe((events) => {
      this.events = events;
    });
  }
}
