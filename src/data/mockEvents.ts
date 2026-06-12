import {
  EVENT_CATEGORIES,
  EVENT_STATUSES,
  type Event,
  type EventCategory,
  type EventStatus,
} from '../types/event';

const LOCATIONS = ['Building A', 'Building B', 'Parking Garage', 'Lobby', 'Server Room'];
const TITLES = [
  'Door forced alarm',
  'Camera offline',
  'Perimeter breach detected',
  'Badge tailgating incident',
  'Patrol checkpoint missed',
  'Video analytics false positive',
  'Access policy violation',
  'Intrusion zone trip',
  'Work order assignment',
  'Escalation to operator',
  'Sensor calibration',
  'Patrol route deviation',
  'NVR storage threshold',
  'Visitor access request',
  'Alarm acknowledgement overdue',
];

function randomItem<T>(arr: readonly T[]): T {
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
    category: randomItem(EVENT_CATEGORIES) as EventCategory,
    status: randomItem(EVENT_STATUSES) as EventStatus,
    description: 'Alarm or work order item tracked for operator review and resolution.',
    location: randomItem(LOCATIONS),
  }));
}

export const INITIAL_EVENTS = generateMockEvents(250);
