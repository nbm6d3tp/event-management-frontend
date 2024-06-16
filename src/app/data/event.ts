type TEvent =
  | {
      id: string;
      title: string;
      description: string;
      start: Date;
      end: Date;
      type: TTypeEvent;
      typeLocation: 'On-site' | 'Hybrid';
      location: string;
      organizer: TPerson;
      participations: TPerson[];
      reviews: TReview[] | null;
    }
  | {
      id: string;
      title: string;
      description: string;
      start: Date;
      end: Date;
      type: TTypeEvent;
      typeLocation: 'Remote';
      location?: never;
      organizer: TPerson;
      participations: TPerson[];
      reviews: TReview[] | null;
    };

type TTypeEvent = 'Meetups' | 'Conferences' | 'Workshops';

const eventData: TEvent[] = [
  {
    id: 'event1',
    title: 'Tech Meetup',
    description:
      'A meetup for tech enthusiasts to discuss the latest trends in technology.',
    start: new Date('2024-05-10T09:00:00'),
    end: new Date('2024-05-12T12:00:00'),
    type: 'Meetups',
    location: 'Tech Park, City Center',
    typeLocation: 'On-site',
    organizer: people[0],
    participations: [people[0], people[1]],
    reviews: [
      {
        id: 'review1',
        person: people[1],
        comment: 'Great event, very informative!',
        rating: 5,
      },
    ],
  },
  {
    id: 'event2',
    title: 'AI Conference 2024',
    description:
      'An annual conference on artificial intelligence and its applications.',
    start: new Date('2024-04-15T10:00:00'),
    end: new Date('2024-04-17T17:00:00'),
    type: 'Conferences',
    location: 'Convention Center, Downtown',
    typeLocation: 'Hybrid',
    organizer: people[1],
    participations: [people[1], people[2]],
    reviews: [
      {
        id: 'review2',
        person: people[2],
        comment: 'Very insightful sessions on AI.',
        rating: 4,
      },
    ],
  },
  {
    id: 'event3',
    title: 'Web Development Workshop',
    description: 'A hands-on workshop on modern web development practices.',
    start: new Date('2024-01-05T14:00:00'),
    end: new Date('2024-01-06T18:00:00'),
    type: 'Workshops',
    location: 'Tech Hub, Silicon Valley',
    typeLocation: 'On-site',
    organizer: people[2],
    participations: [people[2], people[3], people[4]],
    reviews: [
      {
        id: 'review3',
        person: people[3],
        comment: 'Learned a lot about the latest web technologies.',
        rating: 5,
      },
    ],
  },
  {
    id: 'event4',
    title: 'Remote Team Building',
    description:
      'A virtual event to build teamwork skills among remote employees.',
    start: new Date('2024-05-12T15:00:00'),
    end: new Date('2024-05-12T17:00:00'),
    type: 'Meetups',
    typeLocation: 'Remote',
    organizer: people[2],
    participations: [people[2], people[3]],
    reviews: [
      {
        id: 'review4',
        person: people[3],
        comment: 'Engaging activities and great interaction.',
        rating: 4,
      },
    ],
  },
  {
    id: 'event5',
    title: 'Startup Pitch Event',
    description: 'A platform for startups to pitch their ideas to investors.',
    start: new Date('2024-01-20T13:00:00'),
    end: new Date('2024-01-20T16:00:00'),
    type: 'Meetups',
    location: 'Startup Incubator, Tech City',
    typeLocation: 'On-site',
    organizer: people[3],
    participations: [people[3], people[4]],
    reviews: [
      {
        id: 'review5',
        person: people[4],
        comment: 'Amazing pitches and networking opportunities.',
        rating: 5,
      },
    ],
  },
  {
    id: 'event6',
    title: 'Data Science Workshop',
    description: 'An in-depth workshop on data science techniques and tools.',
    start: new Date('2024-12-05T10:00:00'),
    end: new Date('2024-12-05T16:00:00'),
    type: 'Workshops',
    location: 'Data Hub, University Campus',
    typeLocation: 'On-site',
    organizer: people[4],
    participations: [people[4], people[0]],
    reviews: null,
  },
  {
    id: 'event7',
    title: 'Leadership Conference',
    description: 'A conference focused on leadership skills and development.',
    start: new Date('2025-01-18T09:00:00'),
    end: new Date('2025-01-19T17:00:00'),
    type: 'Conferences',
    location: 'Leadership Center, Capital City',
    typeLocation: 'Hybrid',
    organizer: people[0],
    participations: [
      {
        id: 'person7',
        name: 'Grace Kim',
        email: 'grace.kim@example.com',
      },
    ],
    reviews: null,
  },
  {
    id: 'event8',
    title: 'Cybersecurity Workshop',
    description:
      'A workshop on the latest in cybersecurity practices and technologies.',
    start: new Date('2025-02-25T11:00:00'),
    end: new Date('2025-02-25T15:00:00'),
    type: 'Workshops',
    typeLocation: 'On-site',
    location: 'Cyber Center, Tech Valley',
    organizer: people[2],
    participations: [people[2], people[3], people[4], people[0], people[1]],
    reviews: null,
  },
  {
    id: 'event9',
    title: 'Remote Productivity Meetup',
    description:
      'A meetup to discuss tools and strategies for remote work productivity.',
    start: new Date('2025-03-14T10:00:00'),
    end: new Date('2025-03-14T12:00:00'),
    type: 'Meetups',
    typeLocation: 'Remote',
    organizer: people[4],
    participations: [people[4], people[0], people[1]],
    reviews: null,
  },
  {
    id: 'event10',
    title: 'Hybrid Collaboration Workshop',
    description:
      'A workshop on effective collaboration in hybrid work environments.',
    start: new Date('2025-04-22T09:00:00'),
    end: new Date('2025-04-22T12:00:00'),
    type: 'Workshops',
    location: 'Business Center, Tech City',
    organizer: people[0],
    participations: [people[0], people[4]],
    typeLocation: 'Hybrid',
    reviews: null,
  },
];
