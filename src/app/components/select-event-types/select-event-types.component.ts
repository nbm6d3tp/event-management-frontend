import { Component, OnInit, input, model } from '@angular/core';
import { TTypeEvent, typeEventList } from '../../data/event';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-event-types',
  templateUrl: './select-event-types.component.html',
  styleUrl: './select-event-types.component.css',
})
export class SelectEventTypesComponent implements OnInit {
  selectedEventTypes = model<string[]>();
  eventTypesForm = new FormControl(null);
  typeEventList = typeEventList;

  ngOnInit(): void {
    this.eventTypesForm.valueChanges.subscribe((val) => {
      if (val) this.selectedEventTypes.set(val);
    });
  }
}
