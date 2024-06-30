import { Component, OnInit, model } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TTypeEvent } from '../../data/event';
import { EventTypeService } from '../../services/event-type.service';

@Component({
  selector: 'app-select-event-types',
  templateUrl: './select-event-types.component.html',
  styleUrl: './select-event-types.component.css',
})
export class SelectEventTypesComponent implements OnInit {
  selectedEventTypes = model<TTypeEvent[]>();
  eventTypesForm = new FormControl(null);
  typeEventList: TTypeEvent[] = [];

  constructor(private eventTypeService: EventTypeService) {
    this.eventTypeService.eventTypesList$.subscribe((data) => {
      this.typeEventList = data;
    });
  }

  ngOnInit(): void {
    this.eventTypesForm.valueChanges.subscribe((val) => {
      if (val) this.selectedEventTypes.set(val);
    });
  }
}
