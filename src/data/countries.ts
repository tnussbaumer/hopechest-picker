import { Country } from '../types';

/**
 * Mock data for HopeChest countries with the Vision Trip schedule
 */
export const countries: Country[] = [
  {
    id: 'guatemala',
    name: 'Guatemala',
    region: 'Central America',
    ministryType: 'Community-to-Community',
    imgUrl: '/images/guatemala-hero.jpg',
    tags: ['Active', 'Partner', 'Youth Programs'],
    visionTrips: [
      { dateRange: 'Sep 7–12, 2026', tripId: 'VT260902T', registrationUrl: 'https://www.hopechest.org/guatemala-vision-trips/' },
      { dateRange: 'Nov 2–7, 2026', tripId: 'VT261101T', registrationUrl: 'https://www.hopechest.org/guatemala-vision-trips/' },
      { dateRange: 'Feb 22–27, 2027', tripId: 'VT270201T', registrationUrl: 'https://www.hopechest.org/guatemala-vision-trips/' },
      { dateRange: 'Apr 12–17, 2027', tripId: 'VT270401T', registrationUrl: 'https://www.hopechest.org/guatemala-vision-trips/' },
      { dateRange: 'Jun 7–12, 2027', tripId: 'VT270601T', registrationUrl: 'https://www.hopechest.org/guatemala-vision-trips/' },
      { dateRange: 'Jul 16–31, 2027', tripId: 'VT270701T', registrationUrl: 'https://www.hopechest.org/guatemala-vision-trips/' },
      { dateRange: 'Sep 20–25, 2027', tripId: 'VT270901T', registrationUrl: 'https://www.hopechest.org/guatemala-vision-trips/' },
      { dateRange: 'Nov 8–13, 2027', tripId: 'VT271101T', registrationUrl: 'https://www.hopechest.org/guatemala-vision-trips/' },
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
      { dateRange: 'Jan 19–26, 2027', tripId: 'VT270102T', registrationUrl: 'https://www.hopechest.org/uganda-vision-trips/' },
      { dateRange: 'Feb 10–17, 2027', tripId: 'VT270202T', registrationUrl: 'https://www.hopechest.org/uganda-vision-trips/' },
      { dateRange: 'Jul 28–Aug 4, 2027', tripId: 'VT270702', registrationUrl: 'https://www.hopechest.org/uganda-vision-trips/' },
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
      { dateRange: 'Jul 29–Aug 3, 2026', tripId: 'VT260702T', registrationUrl: 'https://www.hopechest.org/ethiopia-vision-trips/' },
      { dateRange: 'Aug 11–16, 2026', tripId: 'VT260801T', registrationUrl: 'https://www.hopechest.org/ethiopia-vision-trips/' },
      { dateRange: 'Oct 28–Nov 2, 2026', tripId: 'VT261001T', registrationUrl: 'https://www.hopechest.org/ethiopia-vision-trips/' },
      { dateRange: 'Feb 10–17, 2027', tripId: 'VT270203T', registrationUrl: 'https://www.hopechest.org/ethiopia-vision-trips/' },
      { dateRange: 'Apr 22–28, 2027', tripId: 'VT270402T', registrationUrl: 'https://www.hopechest.org/ethiopia-vision-trips/' },
      { dateRange: 'Jun 17–23, 2027', tripId: 'VT270602T', registrationUrl: 'https://www.hopechest.org/ethiopia-vision-trips/' },
      { dateRange: 'Sep 23–29, 2027', tripId: 'VT270902T', highlight: 'Meskel Holiday', registrationUrl: 'https://www.hopechest.org/ethiopia-vision-trips/' },
      { dateRange: 'Nov 11–17, 2027', tripId: 'VT271102T', registrationUrl: 'https://www.hopechest.org/ethiopia-vision-trips/' },
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
