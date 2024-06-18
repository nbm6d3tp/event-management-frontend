export type TPerson = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export const people: TPerson[] = [
  {
    id: 'person1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    avatar: 'assets/avatars/ava1.jpg',
  },
  {
    id: 'person2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    avatar: 'assets/avatars/ava2.jpg',
  },
  {
    id: 'person3',
    name: 'Carol White',
    email: 'carol.white@example.com',
    avatar: 'assets/avatars/ava5.jpg',
  },
  {
    id: 'person4',
    name: 'David Brown',
    email: 'david.brown@example.com',
    avatar: 'assets/avatars/ava3.jpg',
  },
  {
    id: 'person5',
    name: 'Eve Green',
    email: 'eve.green@example.com',
    avatar: 'assets/avatars/ava4.jpg',
  },
];
