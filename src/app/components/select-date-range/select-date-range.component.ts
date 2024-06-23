import { Component, Input, OnInit, effect, model } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-date-range',
  templateUrl: './select-date-range.component.html',
  styleUrl: './select-date-range.component.css',
})
export class SelectDateRangeComponent implements OnInit {
  selectedDateRange = model.required<{
    start: Date | null;
    end: Date | null;
  }>();
  dateRangeForm = new FormGroup({
    start: new FormControl<Date | null>(this.selectedDateRange().start),
    end: new FormControl<Date | null>(this.selectedDateRange().end),
  });

  ngOnInit() {
    this.dateRangeForm.valueChanges.subscribe((val) => {
      if (val.start && val.end) {
        this.selectedDateRange.set({
          start: val.start,
          end: val.end,
        });
      }
    });
  }
}
