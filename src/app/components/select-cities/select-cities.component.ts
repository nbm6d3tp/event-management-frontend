import { Component, EventEmitter, Input, Output, model } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { cityGroups } from '../../data/location';
import { TCity } from '../../data/city';

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
  selectedCities = model<string[]>([]);

  cities = this._formBuilder.group({
    cityGroup: '',
  });

  constructor(private _formBuilder: FormBuilder) {}

  filteredData: Observable<{ letter: string; names: ItemData[] }[]> | undefined;
  rawData: Array<{ letter: string; names: ItemData[] }> = [];
  placeholder = 'Cities';

  ngOnInit() {
    this.rawData = cityGroups.map((group) => ({
      letter: group.letter,
      names: group.names.map((name) => ({ item: name, selected: false })),
    }));
    this.filteredData = this.cities.get('cityGroup')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filterGroup(value || '');
      })
    );
  }

  private _filterGroup(value: string): { letter: string; names: ItemData[] }[] {
    if (value) {
      console.log(this.rawData);
      console.log(
        this.rawData
          .map((group) => ({
            letter: group.letter,
            names: _filter(group.names, value),
          }))
          .filter((group) => group.names.length > 0)
      );

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
    data.selected = !data.selected;
    if (data.selected === true) {
      this.selectedCities.set([...this.selectedCities(), data.item]);
    } else {
      this.selectedCities.set(
        this.selectedCities().filter((city) => city !== data.item)
      );
    }
    this.placeholder = this.selectedCities().join(', ');
  };
}
