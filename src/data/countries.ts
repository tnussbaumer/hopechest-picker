import { Country } from '../types';

/**
 * Mock data for HopeChest countries with 2026 Vision Trip schedule
 */
export const countries: Country[] = [
  {
    id: 'guatemala',
    name: 'Guatemala',
    region: 'Central America',
    ministryType: 'Community-to-Community',
    imgUrl: 'https://loremflickr.com/800/600/guatemala,landscape',
    tags: ['Active', 'Partner', 'Youth Programs'],
    visionTrips: [
      {
        dateRange: 'Feb 23–28',
        leader: 'TBD',
        tripId: 'guatemala-feb-2026',
        registrationUrl: 'https://hopechestint.org/register/guatemala-feb-2026',
      },
      {
        dateRange: 'Apr 13–18',
        leader: 'TBD',
        tripId: 'guatemala-apr-2026',
        registrationUrl: 'https://hopechestint.org/register/guatemala-apr-2026',
      },
      {
        dateRange: 'Jun 15–20',
        leader: 'TBD',
        tripId: 'guatemala-jun-2026',
        registrationUrl: 'https://hopechestint.org/register/guatemala-jun-2026',
      },
      {
        dateRange: 'Sep 7–12',
        leader: 'TBD',
        tripId: 'guatemala-sep-2026',
        registrationUrl: 'https://hopechestint.org/register/guatemala-sep-2026',
      },
    ],
  },
  {
    id: 'uganda',
    name: 'Uganda',
    region: 'East Africa',
    ministryType: 'Church-to-Church',
    imgUrl: 'https://loremflickr.com/800/600/uganda,landscape',
    tags: ['Active', 'Partner', 'Education'],
    visionTrips: [
      {
        dateRange: 'Feb 10–18',
        leader: 'TBD',
        tripId: 'uganda-feb-2026',
        registrationUrl: 'https://hopechestint.org/register/uganda-feb-2026',
      },
      {
        dateRange: 'Apr 7–14',
        leader: 'TBD',
        tripId: 'uganda-apr-2026',
        registrationUrl: 'https://hopechestint.org/register/uganda-apr-2026',
      },
      {
        dateRange: 'Jul 27–Aug 4',
        leader: 'TBD',
        tripId: 'uganda-jul-2026',
        registrationUrl: 'https://hopechestint.org/register/uganda-jul-2026',
      },
      {
        dateRange: 'Sep 8–15',
        leader: 'TBD',
        tripId: 'uganda-sep-2026',
        registrationUrl: 'https://hopechestint.org/register/uganda-sep-2026',
      },
    ],
  },
  {
    id: 'russia',
    name: 'Russia',
    region: 'Eastern Europe',
    ministryType: 'Community-to-Community',
    imgUrl: 'https://loremflickr.com/800/600/russia,landscape',
    tags: ['Active', 'Orphan Care'],
    visionTrips: [], // No vision trips available for Russia
  },
  {
    id: 'ethiopia',
    name: 'Ethiopia',
    region: 'East Africa',
    ministryType: 'Community-to-Community',
    imgUrl: 'https://loremflickr.com/800/600/ethiopia,landscape',
    tags: ['Partner', 'Healthcare', 'Education'],
    visionTrips: [
      {
        dateRange: 'Feb 16–20',
        leader: 'Peter Y. & Thad S.',
        tripId: 'ethiopia-feb-2026',
        registrationUrl: 'https://hopechestint.org/register/ethiopia-feb-2026',
      },
      {
        dateRange: 'May 6–11',
        leader: 'TBD',
        tripId: 'ethiopia-may-2026',
        registrationUrl: 'https://hopechestint.org/register/ethiopia-may-2026',
      },
      {
        dateRange: 'Aug 12–17',
        leader: 'TBD',
        tripId: 'ethiopia-aug-2026',
        registrationUrl: 'https://hopechestint.org/register/ethiopia-aug-2026',
      },
    ],
  },
  {
    id: 'kenya',
    name: 'Kenya',
    region: 'East Africa',
    ministryType: 'Church-to-Church',
    imgUrl: 'https://loremflickr.com/800/600/kenya,landscape',
    tags: ['Active', 'Partner', 'Community Development'],
    visionTrips: [], // No vision trips scheduled for Kenya
  },
];
