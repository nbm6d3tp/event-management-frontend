import { TCreateTypeLocation } from './location';
import { TUser } from './person';
import { TFeedback } from './review';

export type TDateResponse = [
  number,
  number,
  number,
  number,
  number,
  ...number[]
];
export type TEventResponse = Omit<
  TEvent,
  'startTime' | 'endTime' | 'feedbacks'
> & {
  startTime: TDateResponse;
  endTime: TDateResponse;
  feedbacks: TFeedbackResponse[];
};

export type TFeedbackResponse = Omit<TFeedback, 'date'> & {
  date: TDateResponse;
};

export type TFilters = {
  eventTypes?: TTypeEvent[] | null; //array ids
  startDate?: string;
  endDate?: string;
  cities?: string[] | null;
  locationTypes?: TCreateTypeLocation[] | null; //array ids
  orderBy?: string | null;
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
  | 'score'
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
      score?: number;
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
      score?: number;
    };

export type TTypeEvent = 'Meetup' | 'Conference' | 'Workshop';
