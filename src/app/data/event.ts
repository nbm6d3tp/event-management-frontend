import { TCreateTypeLocation } from './location';
import { TUser } from './person';
import { TFeedback } from './review';

export type TFilters = {
  eventTypes: TTypeEvent[]; //array ids
  startDate: Date;
  endDate: Date;
  cities: string[];
  locationTypes: TCreateTypeLocation[]; //array ids
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
  | 'startTime'
  | 'endTime'
> & {
  typeEventName: TTypeEvent;
  typeLocation: TCreateTypeLocation;
  locationName?: string;
  startTime: string; //"2011-10-05T14:48:00.000Z"
  endTime: string;
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
      typeLocationName: 'Onsite' | 'Hybrid';
      location: {
        idCity: string;
        name: string;
      };
      organizer: TUser;
      participants: TUser[];
      feedbacks?: TFeedback[];
      image?: string;
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
      typeLocationName: 'Online';
      location?: never;
      organizer: TUser;
      participants: TUser[];
      feedbacks?: TFeedback[];
      image?: string;
    };

export type TTypeEvent = 'Meetup' | 'Conference' | 'Workshop';
