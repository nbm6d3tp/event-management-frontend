export type TUser = {
  lastname: string;
  firstname: string;
  email: string;
  avatar: string;
};

export type TUserRegisterData = TUser & { password: string };

export const people: TUser[] = [
  {
    lastname: 'Johnson',
    firstname: 'Alice',
    email: 'alice.johnson@example.com',
    avatar: 'assets/avatars/ava1.jpg',
  },
  {
    lastname: 'Johnson',
    firstname: 'Alice',
    email: 'bob.smith@example.com',
    avatar: 'assets/avatars/ava2.jpg',
  },
  {
    lastname: 'Johnson',
    firstname: 'Alice',
    email: 'carol.white@example.com',
    avatar: 'assets/avatars/ava5.jpg',
  },
  {
    lastname: 'Johnson',
    firstname: 'Alice',
    email: 'david.brown@example.com',
    avatar: 'assets/avatars/ava3.jpg',
  },
  {
    lastname: 'Johnson',
    firstname: 'Alice',
    email: 'eve.green@example.com',
    avatar: 'assets/avatars/ava4.jpg',
  },
];
