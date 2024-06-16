import { TPerson } from './person';

export type TReview = {
  id: string;
  person: TPerson;
  comment: string;
  rating: number;
};
