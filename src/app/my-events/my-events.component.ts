import { Component, inject } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { MyEventsService } from '../services/my-events.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalDetailEventComponent } from '../components/modal-detail-event/modal-detail-event.component';
import { ModalAddEventComponent } from '../components/modal-add-event/modal-add-event.component';

const colors = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css',
})
export class MyEventsComponent {
  CalendarView = CalendarView;
  refresh = new Subject<void>();
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  events: CalendarEvent[] = [];

  readonly dialog = inject(MatDialog);

  onClickAddEvent() {
    const dialogRef = this.dialog.open(ModalAddEventComponent, {
      height: '80%',
      width: '40%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log({ result });
    });
  }

  onClickEvent(event: CalendarEvent) {
    const eventID = event.meta;
    const dialogRef = this.dialog.open(ModalDetailEventComponent, {
      data: eventID,
      height: '80%',
      width: '40%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log({ result });
    });
  }

  constructor(myEventsService: MyEventsService) {
    myEventsService.getAll().subscribe((events) => {
      this.events = events.map((event) => {
        return {
          start: event.start,
          end: event.end,
          title: event.title,
          actions: this.actions,
          color: { ...colors.red },
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          meta: event.id,
        };
      });
    });
  }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="mx-1 bi bi-pencil"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log('Edit event', event);
      },
    },
    {
      label: '<i class="bi bi-trash"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.activeDayIsOpen = false;
        console.log('Delete event', event);
      },
    },
  ];

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }
}
