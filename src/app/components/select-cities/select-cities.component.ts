import { Component, input, model, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { cityGroups } from '../../data/location';

const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-select-cities',
  templateUrl: './select-cities.component.html',
  styleUrl: './select-cities.component.css',
})
export class SelectCitiesComponent {
  required = input<boolean>(false);
  selectedCities = model<string[]>([]);

  citiesForm = this.fb.group({
    cityGroup: '',
  });

  constructor(private fb: FormBuilder) {}

  filteredData: Observable<{ letter: string; names: string[] }[]> | undefined;
  placeholder = signal('Cities');

  ngOnInit() {
    this.filteredData = this.citiesForm.get('cityGroup')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filterGroup(value || '');
      })
    );
  }

  private _filterGroup(value: string): { letter: string; names: string[] }[] {
    if (value) {
      return cityGroups
        .map((group) => ({
          letter: group.letter,
          names: _filter(group.names, value),
        }))
        .filter((group) => group.names.length > 0);
    }
    return cityGroups;
  }

  optionClicked = (event: Event, data: string): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  toggleSelection = (data: string): void => {
    if (!this.selectedCities().includes(data)) {
      this.selectedCities.set([...this.selectedCities(), data]);
    } else {
      console.log(this.selectedCities().filter((city) => city !== data));
      this.selectedCities.set(
        this.selectedCities().filter((city) => city !== data)
      );
    }
    this.placeholder.set((this.selectedCities() || []).join(', '));
  };
}
