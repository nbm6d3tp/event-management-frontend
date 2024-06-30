import { TEvent } from '../data/event';
import { TUser } from '../data/person';

export const toComment = (event: TEvent, person: TUser) => {
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

export const isEventEnd = (event: TEvent) => {
  return event.endTime.getTime() < new Date().getTime();
};

export const haveParticipated = (event: TEvent, person: TUser) => {
  return event.participants
    .map((person) => person.email)
    .includes(person.email);
};

export const haveCommented = (event: TEvent, person: TUser) => {
  return (
    event.feedbacks &&
    event.feedbacks.length > 0 &&
    event.feedbacks
      .map((feedback) => feedback.participant.email)
      .includes(person.email)
  );
};

export const canDelete = (event: TEvent, person: TUser) =>
  event.organizer.email == person.email && !isEventEnd(event);

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
