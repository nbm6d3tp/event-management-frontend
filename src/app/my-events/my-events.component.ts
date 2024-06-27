import { Component } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { TEvent } from '../data/event';
import { TPerson } from '../data/person';
import { AuthenticationService } from '../services/authentication.service';
import { EventsService } from '../services/events.service';
import { ToastService } from '../services/toast.service';
import { ModalService } from '../services/modal.service';

const toComment = (event: TEvent, person: TPerson) => {
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

const chooseColor = (event: TEvent, person: TPerson) => {
  if (!isEventEnd(event)) return { ...colors.red };
  else if (toComment(event, person)) {
    return { ...colors.yellow };
  }
  return { ...colors.blue };
};

const haveParticipated = (event: TEvent, person: TPerson) => {
  return event.participations.map((person) => person.id).includes(person.id);
};

const haveCommented = (event: TEvent, person: TPerson) => {
  return event.reviews?.map((review) => review.person.id).includes(person.id);
};

export const canDelete = (event: TEvent, person: TPerson) =>
  event.organizer.id == person.id;

export const canEdit = (event: TEvent, person: TPerson) =>
  !isEventEnd(event) && event.organizer.id == person.id;

export const canCancel = (event: TEvent, person: TPerson) =>
  haveParticipated(event, person) &&
  !isEventEnd(event) &&
  !(event.organizer.id == person.id);

export const canParticipate = (event: TEvent, person: TPerson) =>
  !haveParticipated(event, person) &&
  !isEventEnd(event) &&
  !(event.organizer.id == person.id);

export const canComment = (event: TEvent, person: TPerson) =>
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

  onClickAddEvent() {
    this.modalService.openModalAddEvent();
  }

  onClickEditEvent(idEvent: string) {
    this.modalService.openModalAddEvent(idEvent);
  }

  onClickFeedbackEvent() {
    this.modalService.openModalFeedback();
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

  onClickEvent(event: CalendarEvent) {
    this.modalService.openModalDetailEvent(event.meta);
  }
  user?: TPerson | null;

  constructor(
    private myEventsService: EventsService,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private modalService: ModalService
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

  getPossibleActions(event: TEvent, person: TPerson): CalendarEventAction[] {
    const actions = [];
    if (event.organizer.id == person.id) {
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
