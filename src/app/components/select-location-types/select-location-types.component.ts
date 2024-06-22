import { Component, model, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-location-types',
  templateUrl: './select-location-types.component.html',
  styleUrl: './select-location-types.component.css',
})
export class SelectLocationTypesComponent {
  selectedLocationTypes = model<string[]>([]);
  locationTypesForm = new FormControl(this.selectedLocationTypes());

  ngOnInit(): void {
    this.locationTypesForm.valueChanges.subscribe((val) => {
      if (val) this.selectedLocationTypes.set(val);
    });
  }

  hideMultipleSelectionIndicator = signal(false);

  toggleMultipleSelectionIndicator() {
    this.hideMultipleSelectionIndicator.update((value) => !value);
  }
}
