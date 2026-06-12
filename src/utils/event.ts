import type { EventFormValues } from '../components/EventForm';
import type { Event, EventCategory, EventStatus } from '../types/event';

export function toFormValues(event: Event): EventFormValues {
  return {
    title: event.title,
    date: event.date,
    category: event.category,
    status: event.status,
    description: event.description ?? '',
    location: event.location ?? '',
  };
}

export function createEventId(): string {
  return `evt-${Date.now()}`;
}

export function createEvent(values: EventFormValues): Event {
  return {
    id: createEventId(),
    title: values.title.trim(),
    date: values.date,
    category: values.category as EventCategory,
    status: values.status as EventStatus,
    description: values.description.trim(),
    location: values.location.trim(),
  };
}

export function updateEvent(event: Event, values: EventFormValues): Event {
  return {
    ...event,
    title: values.title.trim(),
    date: values.date,
    category: values.category as EventCategory,
    status: values.status as EventStatus,
    description: values.description.trim(),
    location: values.location.trim(),
  };
}
