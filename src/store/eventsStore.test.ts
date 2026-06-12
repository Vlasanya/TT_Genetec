import { describe, expect, it } from 'vitest';
import type { Event } from '../types/event';
import { eventsReducer } from './eventsReducer';

const baseEvent: Event = {
  id: 'evt-1',
  title: 'Door alarm',
  date: '2026-06-10',
  category: 'Access',
  status: 'scheduled',
  description: 'Test',
  location: 'Lobby',
};

describe('eventsReducer', () => {
  it('creates an event', () => {
    const next = eventsReducer([], { type: 'EVENT_CREATED', payload: baseEvent });
    expect(next).toEqual([baseEvent]);
  });

  it('updates an event', () => {
    const updated = { ...baseEvent, status: 'acknowledged' as const };
    const next = eventsReducer([baseEvent], { type: 'EVENT_UPDATED', payload: updated });
    expect(next[0].status).toBe('acknowledged');
  });

  it('deletes an event', () => {
    const next = eventsReducer([baseEvent], { type: 'EVENT_DELETED', payload: { id: 'evt-1' } });
    expect(next).toEqual([]);
  });
});
