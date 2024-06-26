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
import { TEvent } from '../data/event';
import { TUser } from '../data/person';
import { AuthenticationService } from '../services/authentication.service';
import { ModalFeedbackComponent } from '../components/modal-feedback/modal-feedback.component';
import { EventsService } from '../services/events.service';
import { ToastService } from '../services/toast.service';

const toComment = (event: TEvent, person: TUser) => {
  if (
    isEventEnd(event) &&
    event.organizer.id !== person.id &&
    haveParticipated(event, person) &&
    !haveCommented(event, person)
  ) {
    return true;
  }
  return false;
};

const isEventEnd = (event: TEvent) => {
  return event.end.getTime() < new Date().getTime();
};

const chooseColor = (event: TEvent, person: TUser) => {
  if (!isEventEnd(event)) return { ...colors.red };
  else if (toComment(event, person)) {
    return { ...colors.yellow };
  }
  return { ...colors.blue };
};

const haveParticipated = (event: TEvent, person: TUser) => {
  return event.participations.map((person) => person.id).includes(person.id);
};

const haveCommented = (event: TEvent, person: TUser) => {
  return event.reviews?.map((review) => review.person.id).includes(person.id);
};

export const canDelete = (event: TEvent, person: TUser) =>
  event.organizer.id == person.id;

export const canEdit = (event: TEvent, person: TUser) =>
  !isEventEnd(event) && event.organizer.id == person.id;

export const canCancel = (event: TEvent, person: TUser) =>
  haveParticipated(event, person) &&
  !isEventEnd(event) &&
  !(event.organizer.id == person.id);

export const canParticipate = (event: TEvent, person: TUser) =>
  !haveParticipated(event, person) &&
  !isEventEnd(event) &&
  !(event.organizer.id == person.id);

export const canComment = (event: TEvent, person: TUser) =>
  isEventEnd(event) &&
  !(event.organizer.id == person.id) &&
  haveParticipated(event, person) &&
  !haveCommented(event, person);

const colors = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e304f',
    secondary: '#c9d8ff',
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

  onClickEditEvent(idEvent: string) {
    const dialogRef = this.dialog.open(ModalAddEventComponent, {
      height: '80%',
      width: '600px',
      data: idEvent,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  onClickFeedbackEvent() {
    const dialogRef = this.dialog.open(ModalFeedbackComponent, {
      height: '25%',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  onClickCancelEvent() {
    this.toastService.showToastWithConfirm('cancel', () => {
      console.log('Cancel event');
    });
  }

  onClickDeleteEvent() {
    this.toastService.showToastWithConfirm('delete', () => {
      console.log('Delete event');
    });
  }

  onClickAddEvent() {
    const dialogRef = this.dialog.open(ModalAddEventComponent, {
      height: '80%',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  onClickEvent(event: CalendarEvent) {
    const eventID = event.meta;
    const dialogRef = this.dialog.open(ModalDetailEventComponent, {
      data: eventID,
      height: '80%',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  user?: TUser | null;

  constructor(
    private myEventsService: EventsService,
    private authenticationService: AuthenticationService,
    private toastService: ToastService
  ) {
    this.authenticationService.user.subscribe((person) => {
      this.user = person;
      if (person)
        myEventsService.getMyEvents(person.id).subscribe((events) => {
          this.events = events.map((event) => {
            return {
              start: event.start,
              end: event.end,
              title: event.title,
              actions: this.getPossibleActions(event, person),
              color: chooseColor(event, person),
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              meta: event.id,
            };
          });
        });
    });
  }

  getPossibleActions(event: TEvent, person: TUser): CalendarEventAction[] {
    const actions = [];
    if (event.organizer.email == person.email) {
      actions.push({
        label: '<i class="bi bi-trash"></i>',
        a11yLabel: 'Delete',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          // this.events = this.events.filter((iEvent) => iEvent !== event);
          // this.activeDayIsOpen = false;
          this.onClickDeleteEvent();
        },
      });
      if (!isEventEnd(event))
        actions.push({
          label: '<i class="mx-1 bi bi-pencil"></i>',
          a11yLabel: 'Edit',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.onClickEditEvent(event.meta);
            console.log('Edit event', event);
          },
        });
    } else {
      if (isEventEnd(event)) {
        if (haveParticipated(event, person) && !haveCommented(event, person))
          actions.push({
            label: '<i class="mx-1 bi bi-chat-dots"></i>',
            a11yLabel: 'Feedback',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              console.log('Feedback event', event);
              this.onClickFeedbackEvent();
            },
          });
      } else {
        if (haveParticipated(event, person))
          actions.push({
            label: '<i class="mx-1 bi bi-x-circle"></i>',
            a11yLabel: 'Cancel',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.onClickCancelEvent();
            },
          });
      }
    }
    return actions;
  }

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
