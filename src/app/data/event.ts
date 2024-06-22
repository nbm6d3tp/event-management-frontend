import { addDays, addHours, startOfDay, subDays, subHours } from 'date-fns';
import { TPerson, people } from './person';
import { TReview } from './review';
import { TCity, cities } from './city';

export type TCreateEvent = Omit<TEvent, 'id' | 'reviews'>;

export type TEvent =
  | {
      id: string;
      title: string;
      description: string;
      start: Date;
      end: Date;
      type: TTypeEvent;
      typeLocation: 'On-site' | 'Hybrid';
      location: TCity;
      organizer: TPerson;
      participations: TPerson[];
      reviews: TReview[] | null;
      image: string;
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
      image: string;
    };

export type TTypeEvent = 'Meetups' | 'Conferences' | 'Workshops';

export const eventData: TEvent[] = [
  {
    id: 'event1',
    title: 'Tech Meetup',
    description:
      'A meetup for tech enthusiasts to discuss the latest trends in technology. A meetup for tech enthusiasts to discuss the latest trends in technology.',
    start: subDays(startOfDay(new Date()), 30),
    end: subDays(startOfDay(new Date()), 29),
    type: 'Meetups',
    location: cities[0],
    typeLocation: 'On-site',
    organizer: people[0],
    participations: [people[1]],
    reviews: [
      {
        id: 'review1',
        person: people[1],
        comment: 'Great event, very informative!',
        rating: 5,
        date: subDays(new Date(), 1),
      },
    ],
    image:
      'https://lmapqwxheetscsdyjvsi.supabase.co/storage/v1/object/public/Images/events/event1.jpg',
  },
  {
    id: 'event2',
    title: 'AI Conference 2024',
    description:
      'An annual conference on artificial intelligence and its applications.',
    start: subDays(startOfDay(new Date()), 2),
    end: addHours(subDays(startOfDay(new Date()), 2), 2),
    type: 'Conferences',
    location: cities[1],
    typeLocation: 'Hybrid',
    organizer: people[1],
    participations: [people[2]],
    reviews: [
      {
        id: 'review2',
        person: people[2],
        comment: 'Very insightful sessions on AI.',
        rating: 4,
        date: subDays(new Date(), 1),
      },
    ],
    image: 'assets/event-images/event2.jpg',
  },
  {
    id: 'event3',
    title: 'Web Development Workshop',
    description: 'A hands-on workshop on modern web development practices.',
    start: subHours(subDays(startOfDay(new Date()), 4), 6),
    end: subDays(startOfDay(new Date()), 4),
    type: 'Workshops',
    location: cities[2],
    typeLocation: 'On-site',
    organizer: people[2],
    participations: [people[3], people[4]],
    reviews: [
      {
        id: 'review3',
        person: people[3],
        comment: 'Learned a lot about the latest web technologies.',
        rating: 5,
        date: subDays(new Date(), 1),
      },
    ],
    image: 'assets/event-images/event3.jpg',
  },
  {
    id: 'event4',
    title: 'Remote Team Building',
    description:
      'A virtual event to build teamwork skills among remote employees.',
    start: subDays(new Date(), 6),
    end: subDays(new Date(), 5),
    type: 'Meetups',
    typeLocation: 'Remote',
    organizer: people[2],
    participations: [people[3]],
    reviews: [
      {
        id: 'review4',
        person: people[3],
        comment: 'Engaging activities and great interaction.',
        rating: 4,
        date: subDays(new Date(), 1),
      },
    ],
    image: 'assets/event-images/event4.jpg',
  },
  {
    id: 'event5',
    title: 'Startup Pitch Event',
    description: 'A platform for startups to pitch their ideas to investors.',
    start: subHours(new Date(), 4),
    end: new Date(),
    type: 'Meetups',
    location: cities[3],
    typeLocation: 'On-site',
    organizer: people[3],
    participations: [people[4]],
    reviews: [
      {
        id: 'review5',
        person: people[4],
        comment: 'Amazing pitches and networking opportunities.',
        rating: 5,
        date: subDays(new Date(), 1),
      },
    ],
    image: 'assets/event-images/event5.jpg',
  },
  {
    id: 'event6',
    title: 'Data Science Workshop',
    description: 'An in-depth workshop on data science techniques and tools.',
    start: addDays(new Date(), 4),
    end: addDays(new Date(), 5),
    type: 'Workshops',
    location: cities[4],
    typeLocation: 'On-site',
    organizer: people[4],
    participations: [people[0]],
    reviews: null,
    image: 'assets/event-images/event6.jpg',
  },
  {
    id: 'event7',
    title: 'Leadership Conference',
    description: 'A conference focused on leadership skills and development.',
    start: addDays(new Date(), 6),
    end: addHours(addDays(new Date(), 6), 2),
    type: 'Conferences',
    location: cities[5],
    typeLocation: 'Hybrid',
    organizer: people[0],
    participations: [people[1], people[2]],
    image: 'assets/event-images/event7.jpg',
    reviews: null,
  },
  {
    id: 'event8',
    title: 'Cybersecurity Workshop',
    description:
      'A workshop on the latest in cybersecurity practices and technologies.',
    start: addDays(new Date(), 2),
    end: addHours(addDays(new Date(), 2), 2),
    type: 'Workshops',
    typeLocation: 'On-site',
    location: cities[6],
    organizer: people[2],
    participations: [people[3], people[4], people[0], people[1]],
    reviews: null,
    image: 'assets/event-images/event8.jpg',
  },
  {
    id: 'event9',
    title: 'Remote Productivity Meetup',
    description:
      'A meetup to discuss tools and strategies for remote work productivity.',
    start: addDays(new Date(), 3),
    end: addHours(addDays(new Date(), 3), 2),
    type: 'Meetups',
    typeLocation: 'Remote',
    organizer: people[4],
    participations: [people[0], people[1]],
    reviews: null,
    image: 'assets/event-images/event1.jpg',
  },
  {
    id: 'event10',
    title: 'Hybrid Collaboration Workshop',
    description:
      'A workshop on effective collaboration in hybrid work environments.',
    start: addDays(new Date(), 30),
    end: addHours(addDays(new Date(), 31), 2),
    type: 'Workshops',
    location: cities[7],
    organizer: people[0],
    participations: [people[4]],
    typeLocation: 'Hybrid',
    reviews: null,
    image: 'assets/event-images/event2.jpg',
  },
];
