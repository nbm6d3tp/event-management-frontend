import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrl: './select-date.component.css',
})
export class SelectDateComponent {
  label = input.required<string>();
  dateForm = input.required<
    FormGroup<{
      date: FormControl<Date | null>;
    }>
  >();
}
