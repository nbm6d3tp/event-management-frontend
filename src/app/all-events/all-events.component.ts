import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { TEvent, TTypeEvent } from '../data/event';
import { EventsService } from '../services/events.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { TCityGroup, cityGroups } from '../data/location';
import { startWith, map } from 'rxjs/operators';
import { _filter } from '../helpers/location-dropdown';

interface ItemData {
  item: string;
  selected: boolean;
}

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllEventsComponent implements OnInit {
  events: TEvent[] = [];
  filteredData: Observable<{ letter: string; names: ItemData[] }[]> | undefined;
  rawData: Array<{ letter: string; names: ItemData[] }> = [];
  selectData: Array<string> = [];
  cityForm = this._formBuilder.group({
    cityGroup: '',
  });
  placeholder = 'Cities';

  typeEventList: TTypeEvent[] = ['Meetups', 'Conferences', 'Workshops'];
  typeEvents = new FormControl('');

  typesLocation = new FormControl('');

  orderByCriteriaList: ('Date' | 'Note')[] = ['Date', 'Note'];
  orderByCriteria = new FormControl('');

  readonly dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(
    private eventsService: EventsService,
    private _formBuilder: FormBuilder
  ) {
    eventsService.getAll().subscribe((events) => {
      this.events = events;
    });
  }

  hideMultipleSelectionIndicator = signal(false);

  toggleMultipleSelectionIndicator() {
    this.hideMultipleSelectionIndicator.update((value) => !value);
  }

  ngOnInit() {
    this.rawData = cityGroups.map((group) => ({
      letter: group.letter,
      names: group.names.map((name) => ({ item: name, selected: false })),
    }));
    this.filteredData = this.cityForm.get('cityGroup')!.valueChanges.pipe(
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
      this.selectData.push(data.item);
    } else {
      const i = this.selectData.findIndex((value) => value === data.item);
      this.selectData.splice(i, 1);
    }
    this.placeholder = this.selectData.join(', ');
  };
}
