import type { Event, EventStatus } from '../types/event';

const CATEGORIES = ['Security', 'Access Control', 'Maintenance', 'Training', 'Audit'];
const STATUSES: EventStatus[] = ['scheduled', 'completed', 'cancelled'];
const LOCATIONS = ['Building A', 'Building B', 'Parking Garage', 'Lobby', 'Server Room'];
const TITLES = [
  'Camera firmware update',
  'Badge access review',
  'Fire drill coordination',
  'Visitor escort briefing',
  'Perimeter patrol',
  'Alarm panel inspection',
  'New hire security orientation',
  'License plate recognition tuning',
  'Emergency exit audit',
  'Shift handover',
  'Intrusion sensor calibration',
  'Parking gate maintenance',
  'CCTV coverage assessment',
  'Incident response drill',
  'Vendor credential renewal',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): string {
  const time = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(time).toISOString().slice(0, 10);
}

export function generateMockEvents(count: number): Event[] {
  const start = new Date();
  start.setMonth(start.getMonth() - 2);
  const end = new Date();
  end.setMonth(end.getMonth() + 2);

  return Array.from({ length: count }, (_, i) => ({
    id: `evt-${String(i + 1).padStart(4, '0')}`,
    title: `${randomItem(TITLES)} #${i + 1}`,
    date: randomDate(start, end),
    category: randomItem(CATEGORIES),
    status: randomItem(STATUSES),
    description: `Operational event recorded for site monitoring and compliance.`,
    location: randomItem(LOCATIONS),
  }));
}

export const INITIAL_EVENTS = generateMockEvents(250);
