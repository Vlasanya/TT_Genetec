import type { Event } from '../types/event';

export type EventsAction =
  | { type: 'EVENT_CREATED'; payload: Event }
  | { type: 'EVENT_UPDATED'; payload: Event }
  | { type: 'EVENT_DELETED'; payload: { id: string } };

export function eventsReducer(state: Event[], action: EventsAction): Event[] {
  switch (action.type) {
    case 'EVENT_CREATED':
      return [action.payload, ...state];
    case 'EVENT_UPDATED':
      return state.map((event) => (event.id === action.payload.id ? action.payload : event));
    case 'EVENT_DELETED':
      return state.filter((event) => event.id !== action.payload.id);
    default:
      return state;
  }
}
