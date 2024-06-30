import { Component, input, model, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { TCityGroup, _filterGroup } from '../../data/location';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-select-cities',
  templateUrl: './select-cities.component.html',
  styleUrl: './select-cities.component.css',
})
export class SelectCitiesComponent {
  required = input<boolean>(false);
  selectedCities = model<string[]>([]);
  cityGroups: TCityGroup[] = [];
  filteredData: Observable<TCityGroup[]> | undefined;
  placeholder = signal('Cities');

  citiesForm = this.fb.group({
    cityGroup: '',
  });

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {
    this.locationService.locationsList$.subscribe((data) => {
      this.cityGroups = data;
    });
  }

  ngOnInit() {
    this.filteredData = this.citiesForm.get('cityGroup')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return _filterGroup(this.cityGroups, value || '');
      })
    );
  }

  isOptionChecked(city: string) {
    return this.selectedCities()
      .map((selectedCity) => selectedCity)
      .includes(city);
  }

  optionClicked = (event: Event, data: string): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  toggleSelection = (data: string): void => {
    if (
      !this.selectedCities()
        .map((selectedCity) => selectedCity)
        .includes(data)
    ) {
      this.selectedCities.set([...this.selectedCities(), data]);
    } else {
      this.selectedCities.set(
        this.selectedCities().filter((city) => city !== data)
      );
    }
    this.placeholder.set(
      (this.selectedCities().map((selectedCity) => selectedCity) || []).join(
        ', '
      )
    );
  };
}
