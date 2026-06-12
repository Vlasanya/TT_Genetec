import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { Event, EventFormValues } from '../types/event';
import { createEvent, updateEvent } from '../utils/event';
import { eventsReducer } from './eventsReducer';

interface EventsStoreValue {
  events: Event[];
  createEvent: (values: EventFormValues) => Event;
  updateEvent: (event: Event, values: EventFormValues) => Event;
  deleteEvent: (id: string) => void;
}

const EventsStoreContext = createContext<EventsStoreValue | null>(null);

interface EventsProviderProps {
  initialEvents: Event[];
  children: ReactNode;
}

export function EventsProvider({ initialEvents, children }: EventsProviderProps) {
  const [events, dispatch] = useReducer(eventsReducer, initialEvents);

  const value = useMemo<EventsStoreValue>(
    () => ({
      events,
      createEvent: (formValues) => {
        const event = createEvent(formValues);
        dispatch({ type: 'EVENT_CREATED', payload: event });
        return event;
      },
      updateEvent: (event, formValues) => {
        const nextEvent = updateEvent(event, formValues);
        dispatch({ type: 'EVENT_UPDATED', payload: nextEvent });
        return nextEvent;
      },
      deleteEvent: (id) => {
        dispatch({ type: 'EVENT_DELETED', payload: { id } });
      },
    }),
    [events],
  );

  return <EventsStoreContext.Provider value={value}>{children}</EventsStoreContext.Provider>;
}

export function useEventsStore(): EventsStoreValue {
  const context = useContext(EventsStoreContext);
  if (!context) {
    throw new Error('useEventsStore must be used within EventsProvider');
  }
  return context;
}
