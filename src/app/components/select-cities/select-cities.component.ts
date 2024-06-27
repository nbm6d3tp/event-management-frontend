import { Component, input, model, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { TCity, TCityGroup, _filterGroup } from '../../data/location';

@Component({
  selector: 'app-select-cities',
  templateUrl: './select-cities.component.html',
  styleUrl: './select-cities.component.css',
})
export class SelectCitiesComponent {
  required = input<boolean>(false);
  selectedCities = model<TCity[]>([]);
  cityGroups: TCityGroup[] = [];

  citiesForm = this.fb.group({
    cityGroup: '',
  });

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {
    locationService.getAll().subscribe((data) => {
      this.cityGroups = data;
    });
  }

  filteredData: Observable<TCityGroup[]> | undefined;
  placeholder = signal('Cities');

  ngOnInit() {
    this.filteredData = this.citiesForm.get('cityGroup')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return _filterGroup(this.cityGroups, value || '');
      })
    );
  }

  isOptionChecked(idCity: string) {
    return this.selectedCities()
      .map((selectedCity) => selectedCity.idCity)
      .includes(idCity);
  }

  optionClicked = (event: Event, data: TCity): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  toggleSelection = (data: TCity): void => {
    if (
      !this.selectedCities()
        .map((selectedCity) => selectedCity.idCity)
        .includes(data.idCity)
    ) {
      this.selectedCities.set([...this.selectedCities(), data]);
    } else {
      console.log(
        this.selectedCities().filter((city) => city.idCity !== data.idCity)
      );
      this.selectedCities.set(
        this.selectedCities().filter((city) => city.idCity !== data.idCity)
      );
    }
    this.placeholder.set(
      (
        this.selectedCities().map((selectedCity) => selectedCity.name) || []
      ).join(', ')
    );
  };
}
