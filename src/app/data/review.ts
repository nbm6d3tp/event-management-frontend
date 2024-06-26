import { TUser } from './person';

export type TCreateFeedback = Omit<TFeedback, 'participant' | 'date'>;

export type TFeedback = {
  idEvent: string;
  participant: TUser;
  content: string;
  date: Date;
  score: number;
};
