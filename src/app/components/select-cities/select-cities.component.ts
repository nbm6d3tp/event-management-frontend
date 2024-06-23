import { Component, input, model } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { cityGroups } from '../../data/location';

interface ItemData {
  item: string;
  selected: boolean;
}

const _filter = (
  opt: {
    item: string;
    selected: boolean;
  }[],
  value: string
): {
  item: string;
  selected: boolean;
}[] => {
  const filterValue = value.toLowerCase();
  return opt.filter((item) => item.item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-select-cities',
  templateUrl: './select-cities.component.html',
  styleUrl: './select-cities.component.css',
})
export class SelectCitiesComponent {
  required = input<boolean>(false);
  selectedCities = model<string[]>();

  citiesForm = this.fb.group({
    cityGroup: '',
  });

  constructor(private fb: FormBuilder) {}

  filteredData: Observable<{ letter: string; names: ItemData[] }[]> | undefined;
  rawData: Array<{ letter: string; names: ItemData[] }> = [];
  placeholder = 'Cities';

  ngOnInit() {
    this.rawData = cityGroups.map((group) => ({
      letter: group.letter,
      names: group.names.map((name) => ({ item: name, selected: false })),
    }));
    this.filteredData = this.citiesForm.get('cityGroup')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filterGroup(value || '');
      })
    );
  }

  private _filterGroup(value: string): { letter: string; names: ItemData[] }[] {
    if (value) {
      return this.rawData
        .map((group) => ({
          letter: group.letter,
          names: _filter(group.names, value),
        }))
        .filter((group) => group.names.length > 0);
    }
    return this.rawData;
  }

  optionClicked = (event: Event, data: ItemData): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  toggleSelection = (data: ItemData): void => {
    const selectedCities = this.selectedCities();
    if (selectedCities === undefined) return;
    data.selected = !data.selected;
    if (data.selected === true) {
      this.selectedCities.set([...selectedCities, data.item]);
    } else {
      this.selectedCities.set(
        selectedCities.filter((city) => city !== data.item)
      );
    }
    this.placeholder = selectedCities.join(', ');
  };
}
