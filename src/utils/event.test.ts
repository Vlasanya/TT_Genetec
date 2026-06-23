import { describe, expect, it } from 'vitest';
import type { Event } from '../types/event';
import { createEvent, createEventId, toFormValues, updateEvent } from './event';

const sampleEvent: Event = {
  id: 'evt-1',
  title: 'Door alarm',
  date: '2026-06-10',
  category: 'Access',
  status: 'scheduled',
  description: 'Notes',
  location: 'Lobby',
};

describe('event utils', () => {
  it('maps an event to form values', () => {
    expect(toFormValues(sampleEvent)).toEqual({
      title: 'Door alarm',
      date: '2026-06-10',
      category: 'Access',
      status: 'scheduled',
      description: 'Notes',
      location: 'Lobby',
    });
  });

  it('creates a new event from form values', () => {
    const event = createEvent({
      title: ' Patrol ',
      date: '2026-06-11',
      category: 'Patrol',
      status: 'acknowledged',
      description: ' Done ',
      location: ' Garage ',
    });

    expect(event.title).toBe('Patrol');
    expect(event.description).toBe('Done');
    expect(event.location).toBe('Garage');
    expect(event.id).toMatch(
      /^evt-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('generates unique event ids', () => {
    const ids = new Set(Array.from({ length: 10 }, () => createEventId()));
    expect(ids.size).toBe(10);
  });

  it('updates an existing event from form values', () => {
    const updated = updateEvent(sampleEvent, {
      ...toFormValues(sampleEvent),
      title: 'Updated alarm',
      status: 'resolved',
    });

    expect(updated.id).toBe('evt-1');
    expect(updated.title).toBe('Updated alarm');
    expect(updated.status).toBe('resolved');
  });
});
