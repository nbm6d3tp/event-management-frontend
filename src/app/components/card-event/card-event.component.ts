import { Component, Input } from '@angular/core';
import { TEvent } from '../../data/event';
import { TruncateNamePipe } from '../../pipes/truncate-name.pipe';

@Component({
  selector: 'app-card-event',
  templateUrl: './card-event.component.html',
  styleUrl: './card-event.component.css',
})
export class CardEventComponent {
  @Input() event!: TEvent;
}
