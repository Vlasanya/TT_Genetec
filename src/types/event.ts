export type EventStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Event extends Record<string, unknown> {
  id: string;
  title: string;
  date: string;
  category: string;
  status: EventStatus;
  description?: string;
  location?: string;
}

export interface EventFormValues {
  title: string;
  date: string;
  category: string;
  status: EventStatus;
  description: string;
  location: string;
}
