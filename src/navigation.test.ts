import { describe, expect, it } from 'vitest';
import { hashFromView, viewFromHash } from './navigation';

describe('navigation', () => {
  it('maps views to hashes and back', () => {
    expect(hashFromView('home')).toBe('');
    expect(hashFromView('grid')).toBe('#alarms');
    expect(hashFromView('form')).toBe('#event-form');
    expect(hashFromView('timeline')).toBe('#timeline');

    expect(viewFromHash('')).toBe('home');
    expect(viewFromHash('#alarms')).toBe('grid');
    expect(viewFromHash('#event-form')).toBe('form');
    expect(viewFromHash('#timeline')).toBe('timeline');
  });
});
