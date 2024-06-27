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
  | 'idEvent'
  | 'feedbacks'
  | 'participants'
  | 'typeEvent'
  | 'typeLocationName'
  | 'location'
> & {
  typeEventName: string;
  typeLocation: string;
  locationName: string;
};
export type TEvent =
  | {
      idEvent: string;
      title: string;
      description: string;
      startTime: Date;
      endTime: Date;
      typeEvent: {
        idType: string;
        name: TTypeEvent;
      };
      typeLocationName: 'ONSITE' | 'HYBRID';
      location: {
        idCity: string;
        name: string;
      };
      organizer: TUser;
      participants: TUser[];
      feedbacks?: TFeedback[];
      image: string;
    }
  | {
      idEvent: string;
      title: string;
      description: string;
      startTime: Date;
      endTime: Date;
      typeEvent: {
        idType: string;
        name: TTypeEvent;
      };
      typeLocationName: 'ONLINE';
      location?: never;
      organizer: TUser;
      participants: TUser[];
      feedbacks?: TFeedback[];
      image: string;
    };

export type TTypeEvent = 'Meetup' | 'Conference' | 'Workshop';
