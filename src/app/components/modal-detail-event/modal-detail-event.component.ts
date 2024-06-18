import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TEvent } from '../../data/event';
import { EventsService } from '../../services/events.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-detail-event',
  templateUrl: './modal-detail-event.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './modal-detail-event.component.css',
})
export class ModalDetailEventComponent {
  readonly dialogRef = inject(MatDialogRef<ModalDetailEventComponent>);
  readonly eventID = inject<string>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
  data:
    | {
        event: TEvent;
        isError: false;
      }
    | {
        event: null;
        isError: true;
      } = {
    event: null,
    isError: true,
  };

  constructor(private eventsService: EventsService) {
    eventsService.getEvent(this.eventID).subscribe((event) => {
      if (!event) {
        console.error('Event not found');
        this.data = { event: null, isError: true };
        return;
      }
      this.data = { event, isError: false };
      return;
    });
  }
}
