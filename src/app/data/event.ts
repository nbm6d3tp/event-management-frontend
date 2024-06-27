import { TUser } from './person';
import { TFeedback } from './review';

export type TFilters = {
  eventTypes: string[]; //array ids
  startDate: Date;
  endDate: Date;
  cities: string[];
  locationTypes: string[]; //array ids
  orderBy: string;
};

export type TCreateEvent = Omit<
  TEvent,
  'idEvent' | 'feedbacks' | 'participants'
>;
export type TEvent =
  | {
      idEvent: string;
      title: string;
      description: string;
      startTime: Date;
      endTime: Date;
      typeEventName: TTypeEvent;
      typeLocationName: 'ONSITE' | 'HYBRID';
      locationName: string;
      organizer: TUser;
      participants: TUser[];
      feedbacks: TFeedback[] | null;
      image: string;
    }
  | {
      idEvent: string;
      title: string;
      description: string;
      startTime: Date;
      endTime: Date;
      typeEventName: TTypeEvent;
      typeLocationName: 'ONLINE';
      locationName?: never;
      organizer: TUser;
      participants: TUser[];
      feedbacks: TFeedback[] | null;
      image: string;
    };

export type TTypeEvent = {
  idType: string;
  name: 'Meetup' | 'Conference' | 'Workshop';
};
