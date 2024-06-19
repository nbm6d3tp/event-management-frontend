import { TEvent, eventData } from './event';

export type TPerson = {
  id: string;
  password: string;
  name: string;
  email: string;
  avatar: string;
  authdata?: string;
};

export const people: TPerson[] = [
  {
    id: 'person1',
    password: '12345678',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    avatar: 'assets/avatars/ava1.jpg',
  },
  {
    id: 'person2',
    name: 'Bob Smith',
    password: '12345678',
    email: 'bob.smith@example.com',
    avatar: 'assets/avatars/ava2.jpg',
  },
  {
    id: 'person3',
    name: 'Carol White',
    password: '12345678',
    email: 'carol.white@example.com',
    avatar: 'assets/avatars/ava5.jpg',
  },
  {
    id: 'person4',
    name: 'David Brown',
    password: '12345678',
    email: 'david.brown@example.com',
    avatar: 'assets/avatars/ava3.jpg',
  },
  {
    id: 'person5',
    name: 'Eve Green',
    password: '12345678',
    email: 'eve.green@example.com',
    avatar: 'assets/avatars/ava4.jpg',
  },
];
