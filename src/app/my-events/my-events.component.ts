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
import { TUser } from '../data/person';
import { AuthenticationService } from '../services/authentication.service';
import { EventsService } from '../services/events.service';
import { ToastService } from '../services/toast.service';
import { ModalService } from '../services/modal.service';
import { ParticipationService } from '../services/participation.service';

const toComment = (event: TEvent, person: TUser) => {
  if (
    isEventEnd(event) &&
    event.organizer.email !== person.email &&
    haveParticipated(event, person) &&
    !haveCommented(event, person)
  ) {
    return true;
  }
  return false;
};

const isEventEnd = (event: TEvent) => {
  return event.endTime.getTime() < new Date().getTime();
};

const chooseColor = (event: TEvent, person: TUser) => {
  if (!isEventEnd(event)) return { ...colors.red };
  else if (toComment(event, person)) {
    return { ...colors.yellow };
  }
  return { ...colors.blue };
};

const haveParticipated = (event: TEvent, person: TUser) => {
  return event.participants
    .map((person) => person.email)
    .includes(person.email);
};

const haveCommented = (event: TEvent, person: TUser) => {
  return (
    event.feedbacks &&
    event.feedbacks.length > 0 &&
    event.feedbacks
      .map((feedback) => feedback.participant.email)
      .includes(person.email)
  );
};

export const canDelete = (event: TEvent, person: TUser) =>
  event.organizer.email == person.email;

export const canEdit = (event: TEvent, person: TUser) =>
  !isEventEnd(event) && event.organizer.email == person.email;

export const canCancel = (event: TEvent, person: TUser) =>
  haveParticipated(event, person) &&
  !isEventEnd(event) &&
  !(event.organizer.email == person.email);

export const canParticipate = (event: TEvent, person: TUser) =>
  !haveParticipated(event, person) &&
  !isEventEnd(event) &&
  !(event.organizer.email == person.email);

export const canComment = (event: TEvent, person: TUser) =>
  isEventEnd(event) &&
  !(event.organizer.email == person.email) &&
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

  onClickFeedbackEvent(idEvent: string) {
    this.modalService.openModalFeedback(idEvent);
  }

  onClickCancelEvent(idEvent: string) {
    this.toastService.showToastWithConfirm('cancel', () => {
      this.participationService.cancelEvent(idEvent).subscribe({
        next: () => {
          this.eventsService.getEvent(idEvent);
          this.eventsService.getMyEvents();
        },
        error: (error) => {
          this.toastService.showToast('error', error);
        },
      });
    });
  }

  onClickDeleteEvent(eventID: string) {
    this.toastService.showToastWithConfirm('delete', () => {
      this.eventsService.deleteEvent(eventID).subscribe({
        next: () => {
          this.eventsService.getAll();
          this.eventsService.getMyEvents();
        },
        error: (error) => {
          this.toastService.showToast('error', error);
        },
      });
    });
  }

  onClickEvent(event: CalendarEvent) {
    this.modalService.openModalDetailEvent(event.meta);
  }
  user?: TUser | null;

  constructor(
    private eventsService: EventsService,
    private authenticationService: AuthenticationService,
    private participationService: ParticipationService,
    private toastService: ToastService,
    private modalService: ModalService
  ) {
    this.authenticationService.user.subscribe((person) => {
      this.user = person;
      if (person)
        eventsService.getMyEvents().subscribe((events) => {
          this.events = events.map((event) => {
            return {
              start: event.startTime,
              end: event.startTime,
              title: event.title,
              actions: this.getPossibleActions(event, person),
              color: chooseColor(event, person),
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              meta: event.idEvent,
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
          this.onClickDeleteEvent(event.meta);
        },
      });
      if (!isEventEnd(event))
        actions.push({
          label: '<i class="mx-1 bi bi-pencil"></i>',
          a11yLabel: 'Edit',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.onClickEditEvent(event.meta);
          },
        });
    } else {
      if (isEventEnd(event)) {
        if (haveParticipated(event, person) && !haveCommented(event, person))
          actions.push({
            label: '<i class="mx-1 bi bi-chat-dots"></i>',
            a11yLabel: 'Feedback',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.onClickFeedbackEvent(event.meta);
            },
          });
      } else {
        if (haveParticipated(event, person))
          actions.push({
            label: '<i class="mx-1 bi bi-x-circle"></i>',
            a11yLabel: 'Cancel',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.onClickCancelEvent(event.meta);
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
