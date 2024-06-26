import { TUser } from './person';

export type TReview = {
  id: string;
  person: TUser;
  comment: string;
  date: Date;
  rating: number;
};
