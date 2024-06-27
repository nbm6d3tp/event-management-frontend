import { Component, input, model, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { _filterGroup } from '../../data/location';

@Component({
  selector: 'app-select-cities',
  templateUrl: './select-cities.component.html',
  styleUrl: './select-cities.component.css',
})
export class SelectCitiesComponent {
  required = input<boolean>(false);
  selectedCities = model<string[]>([]);
  cityGroups: {
    letter: string;
    names: string[];
  }[] = [];

  citiesForm = this.fb.group({
    cityGroup: '',
  });

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
  ) {
    locationService.getAll().subscribe((data) => {
      this.cityGroups = data;
    });
  }

  filteredData: Observable<{ letter: string; names: string[] }[]> | undefined;
  placeholder = signal('Cities');

  ngOnInit() {
    this.filteredData = this.citiesForm.get('cityGroup')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return _filterGroup(this.cityGroups, value || '');
      }),
    );
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
        this.selectedCities().filter((city) => city !== data),
      );
    }
    this.placeholder.set((this.selectedCities() || []).join(', '));
  };
}
