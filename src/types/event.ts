export const EVENT_CATEGORIES = ['Access', 'Video', 'Intrusion', 'Patrol'] as const;
export const EVENT_STATUSES = ['scheduled', 'acknowledged', 'resolved'] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
export type EventStatus = (typeof EVENT_STATUSES)[number];

export interface Event extends Record<string, unknown> {
  id: string;
  title: string;
  date: string;
  category: EventCategory;
  status: EventStatus;
  description?: string;
  location?: string;
}

export type { EventFormValues } from '../components/EventForm';

export const STATUS_LABELS: Record<EventStatus, string> = {
  scheduled: 'Scheduled',
  acknowledged: 'Acknowledged',
  resolved: 'Resolved',
};
