import { TUser } from './person';
import { TFeedback } from './review';

export type TFilters = {
  eventTypes: TTypeEvent[];
  startDate: Date;
  endDate: Date;
  cities: string[];
  locationTypes: string[];
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

export type TTypeEvent = 'Meetup' | 'Conference' | 'Workshop';
