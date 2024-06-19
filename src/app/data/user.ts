import { TEvent } from './event';

export type TUser = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  events: TEvent[];
};
