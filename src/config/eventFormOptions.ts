import type { EventFormFieldOption } from '../components/EventForm';
import { EVENT_CATEGORIES, EVENT_STATUSES, STATUS_LABELS } from '../types/event';

export const APP_EVENT_FORM_CATEGORIES: EventFormFieldOption[] = EVENT_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));

export const APP_EVENT_FORM_STATUSES: EventFormFieldOption[] = EVENT_STATUSES.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));
