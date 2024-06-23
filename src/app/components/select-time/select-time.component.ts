import { Component, input, model } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrl: './select-time.component.css',
})
export class SelectTimeComponent {
  label = input.required<string>();
  timeForm = input.required<
    FormGroup<{
      time: FormControl<Date | null>;
    }>
  >();
}
